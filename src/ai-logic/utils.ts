// TODO: Move this to the server side
import { EphemeralToken } from "./types";

export async function requestLiveSessionEphemeralToken(additionalSetup: {
	voice: string;
	instructions: string;
	tools: object;
	tool_choice: string;
	turn_detection: {
		type: string;
		silence_duration_ms: number;
	}
}) {
	try {
		// https://platform.openai.com/docs/guides/realtime-webrtc#creating-an-ephemeral-token
		// https://platform.openai.com/docs/api-reference/realtime-sessions/create
		const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "gpt-4o-mini-realtime-preview",
				temperature: 0.6,
				input_audio_transcription: {
					model: "whisper-1",
				},
				...additionalSetup,
			}),
		});

		if (r.status < 200 || r.status >= 299) {
			const body = await r.json().then((data: any) => console.error(data));

			console.error("Failed to create the live session", body);

			throw new Error(
				`Failed to create the live session, Openai status: ${r.status}`
			);
		}

		const ephemeralToken = await r.json() as EphemeralToken;
		return ephemeralToken;
	} catch (error) {
		throw new Error("Failed to create the live session");
	}
}
