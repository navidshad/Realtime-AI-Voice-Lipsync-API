export interface ConversationDialog {
	id: string;
	content: string;
	speaker: 'user' | 'ai';
}

export type AiTools = {
	[key: string]: {
		definition: {
			type: 'function';
			name: string;
			description: string;
			parameters?: {
				type: string;
				properties: Record<string, any>;
				required: string[];
			};
		};
		handler: (args: any) => { success: boolean;[key: string]: any };
	};
};
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

export interface EphemeralToken {
	model: string;
	client_secret: {
		value: string;
	};
	expires_in: number;
}

export type LiveSession = EphemeralToken;