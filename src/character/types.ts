

export interface AudioDataResponse {
	audio: any;
	visemes: string[];
	vtimes: number[];
	vdurations: number[];
	totalDurationInMs: number;
}

export interface AudioData {
	audio: any;
	visemes: string[];
	vtimes: number[];
	vdurations: number[];
	words?: string[];
	wtimes?: number[];
	wdurations?: number[];
}

