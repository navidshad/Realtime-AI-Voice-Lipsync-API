// TODO: Move this to the server side

export async function requestLiveSessionEphemeralToken(options: {
	voice: string;
	instructions: string;
	tools: string[];
	tool_choice: string;
	turn_detection: {
		type: string;
		silence_duration_ms: number;
	}
}) {
	return Promise.resolve({})

	// TODO: Implement this
}
