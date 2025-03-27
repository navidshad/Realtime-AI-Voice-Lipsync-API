export interface AudioDataResponse {
  audio: any;
  visemes: string[];
  vtimes: number[];
  vdurations: number[];
  totalDurationInMs: number;
}

export interface AudioData {
  audio: ArrayBuffer;
  words: any[];
  segments: any[];
  [key: string]: any;
}

export interface SpeakData {
  words: string[];
  wtimes: number[];
  wdurations: number[];
  markers: (() => void)[];
  mtimes: number[];
}
