declare module "talkinghead" {
	export type progressfn = (progress: number) => void;

	export interface Audio {
		audio: ArrayBuffer[];
		visemes: string[];
		vtimes: number[];
		vdurations: number[];
		words: string[];
		wtimes: number[];
		wdurations: number[];
	}

	export interface TalkingHeadConfig {
		lipsyncModules: string[];
		ttsEndpoint: string;
		avatarMute: boolean;
		cameraView: string;
		cameraDistance: number;
		cameraY: number;
		lightAmbientIntensity: number;
		lightDirectIntensity: number;
		modelPixelRatio: number;
		cameraRotateEnable: boolean;
		cameraPanEnable: boolean;
		cameraZoomEnable: boolean;
	}

	export class TalkingHead {
		constructor(element: HTMLElement, config: Partial<TalkingHeadConfig>);
		showAvatar({ url, onprogress }: { url: string, onprogress?: progressfn }): Promise<void>;
		stop(): void;
		speakAudio(data: Audio): void;
		lookAt(x: number, y: number, duration: number): void;
		setView(view: string): void;
		setMood(mood: string): void;
		playGesture(gesture: string, duration: number, mirror: boolean): void;
	}
} 