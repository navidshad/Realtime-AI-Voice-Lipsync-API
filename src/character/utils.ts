import { AudioData, AudioDataResponse } from "./types";


export async function generateLipSyncDataFromServer(text: string) {
	console.log('generateLipSyncDataFromServer');

	const r = await fetch(`http://localhost:8080/lipsinc/generate?text=${encodeURIComponent(text)}`);
	const data = await r.json() as AudioDataResponse;

	return data
}

async function generateSpeechFromText(text: string): Promise<ArrayBuffer> {
	console.log('generateSpeechFromText');
	const response = await fetch('https://api.openai.com/v1/audio/speech', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
		},
		body: JSON.stringify({
			model: 'tts-1',
			input: text,
			voice: 'alloy',
			response_format: 'mp3'
		}),
	});

	if (!response.ok) {
		throw new Error(`Failed to generate speech: ${response.statusText}`);
	}

	return await response.arrayBuffer();
}

async function getTranscriptionFromAudio(audioBuffer: ArrayBuffer): Promise<any> {
	console.log('getTranscriptionFromAudio');
	const form = new FormData();
	const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
	form.append('file', audioBlob, 'audio.mp3');
	form.append('model', 'whisper-1');
	form.append('language', 'en');
	form.append('response_format', 'verbose_json');
	form.append('prompt', '[The following is a full verbatim transcription without additional details, comments or emojis:]');
	form.append('timestamp_granularities[]', 'word');
	form.append('timestamp_granularities[]', 'segment');

	const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
		},
		body: form,
	});

	if (!response.ok) {
		throw new Error(`Failed to get transcription: ${response.statusText}`);
	}

	return await response.json();
}

interface TranscriptionWord {
	word: string;
	start: number;
	end: number;
}

interface TranscriptionSegment {
	start: number;
	text: string;
}

interface TranscriptionResponse {
	words: TranscriptionWord[];
	segments: TranscriptionSegment[];
}

interface AudioDataObject {
	words: string[];
	wtimes: number[];
	wdurations: number[];
	markers: (() => void)[];
	mtimes: number[];
}

function generateLipSyncDataFromTranscription(text: string, transcription: TranscriptionResponse): AudioDataObject {
	const audioData: AudioDataObject = {
		words: [],
		wtimes: [],
		wdurations: [],
		markers: [],
		mtimes: [],
	};

	// Process words
	transcription.words.forEach(word => {
		audioData.words.push(word.word);
		audioData.wtimes.push(1000 * word.start - 150); // Adjust timing to match example
		audioData.wdurations.push(1000 * (word.end - word.start));
	});

	// Process segments for markers
	transcription.segments.forEach(segment => {
		if (segment.start > 2 && segment.text.length > 10) {
			// Add a marker for looking at camera and speaking with hands
			audioData.markers.push(() => {
				// These actions will be handled by the TalkingHead instance
				// We just need to provide the timing
			});
			audioData.mtimes.push(1000 * segment.start - 1000);
		}
	});

	return audioData;
}

export async function generateSpeechWithLipSync(text: string): Promise<AudioData> {
	console.log('generateSpeechWithLipSync');

	try {
		// Step 1: Generate speech from text
		const audioBuffer = await generateSpeechFromText(text);

		// Step 2: Get transcription with word timings
		const transcription = await getTranscriptionFromAudio(audioBuffer);

		// Step 3: Generate lip sync data
		const lipSyncData = generateLipSyncDataFromTranscription(text, transcription);

		// Step 4: Combine all data into the final AudioData format
		return {
			// audio: {
			// 	type: 'pcm',
			// 	data: [audioBuffer],
			// },
			audio: audioBuffer,
			...lipSyncData
		};
	} catch (error) {
		console.error('Error in generateSpeechWithLipSync:', error);
		throw error;
	}
}