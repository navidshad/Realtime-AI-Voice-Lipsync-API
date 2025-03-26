

export interface AudioDataResponse {
	audio: any;
	visemes: string[];
	vtimes: number[];
	vdurations: number[];
	totalDurationInMs: number;
}

export interface AudioData {
	audio: ArrayBuffer;
	[key: string]: any;
}

