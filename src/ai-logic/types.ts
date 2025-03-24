export interface ConversationDialog {
	id: string;
	content: string;
	speaker: 'user' | 'ai';
}

export interface TokenUsage {
	total_tokens: number;
	input_tokens: number;
	output_tokens: number;
	input_token_details: {
		cached_tokens: number;
		text_tokens: number;
		audio_tokens: number;
		cached_tokens_details: {
			text_tokens: number;
			audio_tokens: number;
		};
	};
	output_token_details: {
		text_tokens: number;
		audio_tokens: number;
	};
}