import { AudioData, AudioDataResponse } from "./types";

export async function generateLipSyncDataFromServer(text: string) {
  console.log("generateLipSyncDataFromServer");

  const r = await fetch(
    `http://localhost:8080/lipsinc/generate?text=${encodeURIComponent(text)}`
  );
  const data = (await r.json()) as AudioDataResponse;

  return data;
}

async function generateSpeechFromText(text: string): Promise<ArrayBuffer> {
  console.log("generateSpeechFromText");
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "tts-1",
      input: text,
      voice: "alloy",
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate speech: ${response.statusText}`);
  }

  return await response.arrayBuffer();
}

async function getTranscriptionFromAudio(
  blobFile: Blob,
  extension: string = "mp3"
): Promise<any> {
  console.log("getTranscriptionFromAudio");
  const form = new FormData();
  form.append("file", blobFile, `audio.${extension}`);
  form.append("model", "whisper-1");
  form.append("language", "en");
  form.append("response_format", "verbose_json");
  form.append(
    "prompt",
    "[The following is a full verbatim transcription without additional details, comments or emojis:]"
  );
  form.append("timestamp_granularities[]", "word");
  form.append("timestamp_granularities[]", "segment");

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: form,
    }
  );

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

export async function generateSpeechWithLipSync(options: {
  text?: string;
  webmBlob?: Blob;
}): Promise<AudioData> {
  console.log("generateSpeechWithLipSync");

  if (options.text) {
    const audioBuffer = await generateSpeechFromText(options.text);

    // Step 2: Create audio blob for transcription
    // Convert the audio buffer to the appropriate format (mp3 for text-to-speech, wav for webmBlob)
    const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });

    // Step 3: Generate transcription with word timings
    const transcription = await getTranscriptionFromAudio(audioBlob, "mp3");

    // // Step 4: Convert transcription to lip sync data
    // const lipSyncData = generateLipSyncDataFromTranscription(transcription);

    // Step 5: Return combined audio and lip sync data
    return {
      audio: audioBuffer!,
      words: transcription.words,
      segments: transcription.segments,
    };
  } else if (options.webmBlob) {
    const transcription = await getTranscriptionFromAudio(
      options.webmBlob,
      "webm"
    );

    // const lipSyncData = generateLipSyncDataFromTranscription(transcription);

    return {
      audio: await options.webmBlob.arrayBuffer(),
      words: transcription.words,
      segments: transcription.segments,
    };
  } else {
    throw new Error("No text or webmBlob provided");
  }
}
