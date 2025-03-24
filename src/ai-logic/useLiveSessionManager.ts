import { useAtom, useSetAtom } from 'jotai';
import { useRef } from 'react';
import {
	liveSessionIdAtom,
	liveSessionAtom,
	sessionStartedAtom,
	conversationDialogsAtom,
	isMicrophoneMutedAtom,
	tokenUsageAtom,
} from '../store/atoms';
import { requestLiveSessionEphemeralToken } from './utils';
import { TokenUsage, LiveSession, EphemeralToken } from './types';

export function useLiveSessionManager() {
	// State atoms
	const [liveSessionId, setLiveSessionId] = useAtom(liveSessionIdAtom);
	const [liveSession, setLiveSession] = useAtom(liveSessionAtom);
	const [sessionStarted, setSessionStarted] = useAtom(sessionStartedAtom);
	const [conversationDialogs, setConversationDialogs] = useAtom(conversationDialogsAtom);
	const [isMicrophoneMuted, setIsMicrophoneMuted] = useAtom(isMicrophoneMutedAtom);
	const [tokenUsage, setTokenUsage] = useAtom(tokenUsageAtom);

	// Refs for persistent values
	const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
	const dataChannelRef = useRef<RTCDataChannel | null>(null);
	const audioElementRef = useRef<HTMLAudioElement | null>(null);
	const microphoneStreamRef = useRef<MediaStream | null>(null);
	const microphoneTrackRef = useRef<MediaStreamTrack | null>(null);
	const onUpdateCallbackRef = useRef<((data: any) => void) | null>(null);
	const sessionToolsRef = useRef<{ [key: string]: any } | null>(null);

	const startLiveSession = async (session: LiveSession) => {
		if (peerConnectionRef.current === null) {
			throw new Error('Peer connection not set up');
		}

		// Set up data channel for sending and receiving events
		dataChannelRef.current = peerConnectionRef.current.createDataChannel('oai-events');

		dataChannelRef.current.addEventListener('message', (e) => {
			const data = JSON.parse(e.data);
			onSessionEvent(data);
		});

		// Start the session using the Session Description Protocol (SDP)
		const offer = await peerConnectionRef.current.createOffer();
		await peerConnectionRef.current.setLocalDescription(offer);

		const baseUrl = 'https://api.openai.com/v1/realtime';
		const model = session.model;
		const EPHEMERAL_KEY = session.client_secret.value;

		const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
			method: 'POST',
			body: offer.sdp,
			headers: {
				Authorization: `Bearer ${EPHEMERAL_KEY}`,
				'Content-Type': 'application/sdp',
			},
		});

		const answer = {
			type: 'answer',
			sdp: await sdpResponse.text(),
		};

		await peerConnectionRef.current.setRemoteDescription(answer as any);
		setSessionStarted(true);
	};

	const createLiveSession = async (options: {
		sessionDetails: {
			instructions: string;
			voice?: string;
			turnDetectionSilenceDuration?: number;
		};
		tools: { [key: string]: any };
		onUpdate?: (data: any) => void;
		audioRef: HTMLAudioElement | null;
	}) => {
		console.log('createLiveSession');

		const { sessionDetails, tools, onUpdate, audioRef } = options;

		// Store the tools and callback
		sessionToolsRef.current = tools;
		onUpdateCallbackRef.current = onUpdate || null;
		audioElementRef.current = audioRef;

		try {
			// Create the session
			const session = await requestLiveSessionEphemeralToken({
				voice: sessionDetails.voice || 'alloy',
				instructions: sessionDetails.instructions,
				tools: Object.values(tools).map((t) => t.definition),
				tool_choice: 'auto',
				turn_detection: {
					type: 'server_vad',
					silence_duration_ms: sessionDetails.turnDetectionSilenceDuration || 1000,
				},
			});

			// Set the live session state
			setLiveSession(session);

			// Create record and continue with setup
			await createLiveSessionRecordOnServer();
			await setupRTP();
			await startLiveSession(session);
			toggleMicrophone(false);

			return { success: true, session };
		} catch (error) {
			console.error('Failed to create live session:', error);
			throw error;
		}
	};

	const setupRTP = async () => {
		if (!audioElementRef.current) {
			throw new Error('Audio element not provided');
		}

		// Create a peer connection
		peerConnectionRef.current = new RTCPeerConnection();

		// Set up to play remote audio from the model
		audioElementRef.current.autoplay = true;
		peerConnectionRef.current.ontrack = (e) => {
			if (audioElementRef.current) audioElementRef.current.srcObject = e.streams[0];
		};

		// Add local audio track for microphone input in the browser
		microphoneStreamRef.current = await navigator.mediaDevices.getUserMedia({
			audio: true,
		});
		microphoneTrackRef.current = microphoneStreamRef.current.getTracks()[0];
		peerConnectionRef.current.addTrack(microphoneTrackRef.current);
	};

	const onSessionEvent = (eventData: any) => {
		if (onUpdateCallbackRef.current) {
			onUpdateCallbackRef.current(eventData);
		}

		const { type, event_id } = eventData;

		if (type === 'session.created') {
			console.log('Session created', event_id);
		}
		else if (type === 'response.audio_transcript.delta') {
			const { delta, response_id } = eventData;
			updateConversationDialogs(delta, response_id, 'ai');
		}
		else if (type === 'conversation.item.input_audio_transcription.completed') {
			const { item_id, transcript } = eventData;

			if (transcript) {
				updateConversationDialogs(transcript, item_id, 'user');
				updateLiveSessionRecordOnServer();
			}
		}
		else if (type === 'response.done' && eventData.response.output) {
			const [output01] = eventData.response.output;

			if (!output01) return;

			if (output01.type === 'function_call') {
				onFunctionCall(eventData);
			}

			if (eventData.response.usage) {
				updateTokenUsage(eventData.response.usage);
				updateLiveSessionRecordOnServer();
			}
		}
		else if (type === 'error') {
			console.error('Error from AI', eventData);
		}
	};

	const endLiveSession = () => {
		if (peerConnectionRef.current === null) {
			console.warn('No active peer connection to close');
			return { success: false, message: 'No active session' };
		}

		peerConnectionRef.current.close();
		peerConnectionRef.current = null;
		dataChannelRef.current = null;

		if (microphoneTrackRef.current) {
			microphoneTrackRef.current.stop();
			microphoneTrackRef.current = null;
		}
		if (microphoneStreamRef.current) {
			microphoneStreamRef.current.getTracks().forEach(track => track.stop());
			microphoneStreamRef.current = null;
		}

		setSessionStarted(false);
		setLiveSession(null);
		setIsMicrophoneMuted(false);

		return { success: true };
	};

	const onFunctionCall = (eventData: any) => {
		if (!sessionToolsRef.current || !dataChannelRef.current) return;

		const [output01] = eventData.response.output;
		console.log('Function call', output01);

		const functionName = output01.name as string;
		const args = JSON.parse(output01.arguments);

		const fn = sessionToolsRef.current[functionName];
		let fnResponse: { success: boolean;[key: string]: any } = { success: false };

		if (!fn) {
			console.error(`Function ${functionName} not found in tools`);
			fnResponse = { success: false, message: `Function ${functionName} not found` };
		} else {
			try {
				fnResponse = fn.handler(args);
			} catch (error) {
				console.error('Error calling function', functionName, error);
				fnResponse = { success: false, message: String(error) };
			}
		}

		const response = {
			type: 'conversation.item.create',
			item: {
				type: 'function_call_output',
				call_id: output01.call_id,
				output: JSON.stringify(fnResponse),
			},
		};

		if (!dataChannelRef.current) return;

		dataChannelRef.current.send(JSON.stringify(response));

		const continueResponse = {
			type: 'response.create',
		};

		dataChannelRef.current.send(JSON.stringify(continueResponse));
	};

	const triggerConversation = (message: string) => {
		if (!dataChannelRef.current) {
			throw new Error('No data channel available to send message');
		}

		const responseCreate = {
			type: 'response.create',
			response: {
				modalities: ['text', 'audio'],
				instructions: message,
			},
		};

		dataChannelRef.current.send(JSON.stringify(responseCreate));
	};

	const updateConversationDialogs = (content: string, id: string, speaker: 'user' | 'ai') => {
		setConversationDialogs(prev => {
			const index = prev.findIndex((d) => d.id === id);
			if (index === -1) {
				return [...prev, { id, content, speaker }];
			} else {
				const newDialogs = [...prev];
				newDialogs[index] = { ...newDialogs[index], content: newDialogs[index].content + content };
				return newDialogs;
			}
		});
	};

	const clearConversationDialogs = () => {
		setConversationDialogs([]);
	};

	const toggleMicrophone = (active?: boolean) => {
		if (active !== undefined) {
			if (microphoneTrackRef.current) {
				setIsMicrophoneMuted(true);
				microphoneTrackRef.current.enabled = false;
			}
		}
		else if (microphoneTrackRef.current) {
			setIsMicrophoneMuted(prev => {
				const newState = !prev;
				microphoneTrackRef.current!.enabled = !newState;
				return newState;
			});
		}

		return isMicrophoneMuted;
	};

	const updateTokenUsage = (usage: TokenUsage) => {
		setTokenUsage(prev => {
			if (!prev) {
				return {
					total_tokens: 0,
					input_tokens: 0,
					output_tokens: 0,
					input_token_details: {
						cached_tokens: 0,
						text_tokens: 0,
						audio_tokens: 0,
						cached_tokens_details: {
							text_tokens: 0,
							audio_tokens: 0,
						},
					},
					output_token_details: {
						text_tokens: 0,
						audio_tokens: 0,
					},
				};
			}

			return {
				total_tokens: prev.total_tokens + usage.total_tokens,
				input_tokens: prev.input_tokens + usage.input_tokens,
				output_tokens: prev.output_tokens + usage.output_tokens,
				input_token_details: {
					cached_tokens: prev.input_token_details.cached_tokens + usage.input_token_details.cached_tokens,
					text_tokens: prev.input_token_details.text_tokens + usage.input_token_details.text_tokens,
					audio_tokens: prev.input_token_details.audio_tokens + usage.input_token_details.audio_tokens,
					cached_tokens_details: {
						text_tokens: prev.input_token_details.cached_tokens_details.text_tokens + usage.input_token_details.cached_tokens_details.text_tokens,
						audio_tokens: prev.input_token_details.cached_tokens_details.audio_tokens + usage.input_token_details.cached_tokens_details.audio_tokens,
					},
				},
				output_token_details: {
					text_tokens: prev.output_token_details.text_tokens + usage.output_token_details.text_tokens,
					audio_tokens: prev.output_token_details.audio_tokens + usage.output_token_details.audio_tokens,
				},
			};
		});
	};

	const createLiveSessionRecordOnServer = async () => {
		// const res = await functionProvider.run({
		// 	name: 'create-live-session-record',
		// 	args: {
		// 		type: 'bundle-practice',
		// 		userId: authUser?.id,
		// 		session: liveSession,
		// 	},
		// });
		// setLiveSessionId(res._id);
	};

	const updateLiveSessionRecordOnServer = async () => {
		// if (!liveSessionId) {
		// 	throw new Error('No live session record id found');
		// }

		// const totalDialogs = conversationDialogs.length;
		// const lastDialog = totalDialogs > 0 ? conversationDialogs[totalDialogs - 1] : null;

		// await functionProvider.run({
		// 	name: 'update-live-session-record',
		// 	args: {
		// 		sessionId: liveSessionId,
		// 		userId: authUser?.id,
		// 		update: { usage: tokenUsage, dialogs: [lastDialog] },
		// 	},
		// });
	};

	return {
		// State
		liveSession,
		sessionStarted,
		conversationDialogs,
		isMicrophoneMuted,
		tokenUsage,

		// Actions
		createLiveSession,
		endLiveSession,
		triggerConversation,
		clearConversationDialogs,
		toggleMicrophone,
	};
} 