import { useAtom, useSetAtom } from 'jotai';
import {
	liveSessionIdAtom,
	liveSessionAtom,
	sessionStartedAtom,
	conversationDialogsAtom,
	isMicrophoneMutedAtom,
	tokenUsageAtom,
} from '../store/atoms';
import { requestLiveSessionEphemeralToken } from './utils';
import { TokenUsage } from './types';

export function useLiveSessionManager() {
	// State atoms
	const [liveSessionId, setLiveSessionId] = useAtom(liveSessionIdAtom);
	const [liveSession, setLiveSession] = useAtom(liveSessionAtom);
	const [sessionStarted, setSessionStarted] = useAtom(sessionStartedAtom);
	const [conversationDialogs, setConversationDialogs] = useAtom(conversationDialogsAtom);
	const [isMicrophoneMuted, setIsMicrophoneMuted] = useAtom(isMicrophoneMutedAtom);
	const [tokenUsage, setTokenUsage] = useAtom(tokenUsageAtom);

	// RTCPeerConnection state
	let peerConnection: RTCPeerConnection | null = null;
	let dataChannel: RTCDataChannel | null = null;
	let audioElement: HTMLAudioElement | null = null;
	let microphoneStream: MediaStream | null = null;
	let microphoneTrack: MediaStreamTrack | null = null;

	// Custom callback function that will be called on session events
	let onUpdateCallback: ((data: any) => void) | null = null;
	let sessionTools: { [key: string]: any } | null = null;

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
		const { sessionDetails, tools, onUpdate, audioRef } = options;

		// Store the tools and callback
		sessionTools = tools;
		onUpdateCallback = onUpdate || null;
		audioElement = audioRef;

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

			setLiveSession(session);
			await createLiveSessionRecordOnServer();

			// Set up RTP and start the session
			await setupRTP();
			await startLiveSession();

			// mute the microphone
			toggleMicrophone(false);

			return { success: true, session };
		} catch (error) {
			console.error('Failed to create live session:', error);
			throw error;
		}
	};

	const setupRTP = async () => {
		if (!audioElement) {
			throw new Error('Audio element not provided');
		}

		// Create a peer connection
		peerConnection = new RTCPeerConnection();

		// Set up to play remote audio from the model
		audioElement.autoplay = true;
		peerConnection.ontrack = (e) => {
			if (audioElement) audioElement.srcObject = e.streams[0];
		};

		// Add local audio track for microphone input in the browser
		microphoneStream = await navigator.mediaDevices.getUserMedia({
			audio: true,
		});
		microphoneTrack = microphoneStream.getTracks()[0];
		peerConnection.addTrack(microphoneTrack);
	};

	const startLiveSession = async () => {
		if (liveSession === null) {
			throw new Error('No active session to start');
		}

		if (peerConnection === null) {
			throw new Error('Peer connection not set up');
		}

		// Set up data channel for sending and receiving events
		dataChannel = peerConnection.createDataChannel('oai-events');

		dataChannel.addEventListener('message', (e) => {
			const data = JSON.parse(e.data);
			onSessionEvent(data);
		});

		// Start the session using the Session Description Protocol (SDP)
		const offer = await peerConnection.createOffer();
		await peerConnection.setLocalDescription(offer);

		const baseUrl = 'https://api.openai.com/v1/realtime';
		const model = liveSession.model;
		const EPHEMERAL_KEY = liveSession.client_secret.value;

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

		await peerConnection.setRemoteDescription(answer as any);
		setSessionStarted(true);
	};

	const onSessionEvent = (eventData: any) => {
		if (onUpdateCallback) {
			onUpdateCallback(eventData);
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
		if (peerConnection === null) {
			console.warn('No active peer connection to close');
			return { success: false, message: 'No active session' };
		}

		peerConnection.close();
		peerConnection = null;
		dataChannel = null;

		if (microphoneTrack) {
			microphoneTrack.stop();
			microphoneTrack = null;
		}
		if (microphoneStream) {
			microphoneStream.getTracks().forEach(track => track.stop());
			microphoneStream = null;
		}

		setSessionStarted(false);
		setLiveSession(null);
		setIsMicrophoneMuted(false);

		return { success: true };
	};

	const onFunctionCall = (eventData: any) => {
		if (!sessionTools || !dataChannel) return;

		const [output01] = eventData.response.output;
		console.log('Function call', output01);

		const functionName = output01.name as string;
		const args = JSON.parse(output01.arguments);

		const fn = sessionTools[functionName];
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

		if (!dataChannel) return;

		dataChannel.send(JSON.stringify(response));

		const continueResponse = {
			type: 'response.create',
		};

		dataChannel.send(JSON.stringify(continueResponse));
	};

	const triggerConversation = (message: string) => {
		if (!dataChannel) {
			throw new Error('No data channel available to send message');
		}

		const responseCreate = {
			type: 'response.create',
			response: {
				modalities: ['text', 'audio'],
				instructions: message,
			},
		};

		dataChannel.send(JSON.stringify(responseCreate));
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
			if (microphoneTrack) {
				setIsMicrophoneMuted(true);
				microphoneTrack.enabled = false;
			}
		}
		else if (microphoneTrack) {
			setIsMicrophoneMuted(prev => {
				const newState = !prev;
				microphoneTrack!.enabled = !newState;
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
		if (!liveSessionId) {
			throw new Error('No live session record id found');
		}

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