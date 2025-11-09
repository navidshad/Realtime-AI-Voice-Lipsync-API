export interface AudioDataResponse {
  audio: any;
  visemes: string[];
  vtimes: number[];
  vdurations: number[];
  totalDurationInMs: number;
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

export interface TranscriptionResponse {
  words: TranscriptionWord[];
  segments: TranscriptionSegment[];
}

export interface AudioData {
  audio: ArrayBuffer;
  words: TranscriptionWord[];
  segments: TranscriptionSegment[];
  [key: string]: any;
}

export interface SpeakData {
  words: string[];
  wtimes: number[];
  wdurations: number[];
  markers: (() => void)[];
  mtimes: number[];
}
