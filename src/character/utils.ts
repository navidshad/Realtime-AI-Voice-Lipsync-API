import { AudioData, AudioDataResponse } from "./types";


export async function generateLipSyncData(text: string) {
	const r = await fetch(`http://localhost:8080/lipsinc/generate?text=${encodeURIComponent(text)}`);
	const data = await r.json() as AudioDataResponse;


	return {
		...data,
		audio: createFakeLipSync(data.totalDurationInMs),
	}
}

export const createFakeLipSync = (durationMs = 3000): AudioData => {
	// Oculus viseme codes
	const visemes = [
		"sil",
		"PP",
		"FF",
		"TH",
		"DD",
		"kk",
		"CH",
		"SS",
		"nn",
		"RR",
		"aa",
		"E",
		"I",
		"O",
		"U",
	];

	// Create arrays for our viseme data
	const fakeLipSync: {
		visemes: string[];
		vtimes: number[];
		vdurations: number[];
	} = {
		visemes: [],
		vtimes: [],
		vdurations: [],
	};

	// Create a silent PCM audio buffer (we need this for timing)
	const sampleRate = 22050;
	const numSamples = Math.ceil((sampleRate * durationMs) / 1000);
	const silentAudio = new Int16Array(numSamples);

	// Generate a realistic sequence of visemes
	let currentTime = 0;
	while (currentTime < durationMs) {
		// Pick a random viseme, but make vowels more likely
		const rnd = Math.random();
		let visemeIndex;

		if (rnd < 0.4) {
			// 40% chance of vowel (aa, E, I, O, U)
			visemeIndex = 10 + Math.floor(Math.random() * 5);
		} else if (rnd < 0.7) {
			// 30% chance of consonant
			visemeIndex = 1 + Math.floor(Math.random() * 9);
		} else {
			// 30% chance of silence
			visemeIndex = 0;
		}

		const viseme = visemes[visemeIndex];
		const duration = 50 + Math.floor(Math.random() * 150); // 50-200ms per viseme

		fakeLipSync.visemes.push(viseme);
		fakeLipSync.vtimes.push(currentTime);
		fakeLipSync.vdurations.push(duration);

		currentTime += duration;
	}

	return {
		audio: {
			type: "pcm",
			data: [silentAudio.buffer], // Wrap buffer in array as it expects array of chunks
		},
		...fakeLipSync,
		words: [], // Empty arrays for required fields
		wtimes: [],
		wdurations: [],
	};
};