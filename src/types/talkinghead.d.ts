declare module "talkinghead" {
	export type progressfn = (progress: number) => void;

	export interface Audio {
		audio: ArrayBuffer[];
		words: string[];
		wtimes: number[];
		wdurations: number[];
		[key: string]: any;
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
		showAvatar(options: { url: string, body: string, avatarMood: string, lipsyncLang: string, onprogress?: progressfn }): Promise<void>;
		stop(): void;
		speakAudio(data: Audio): void;
		lookAt(x: number, y: number, duration: number): void;
		setView(view: string): void;
		setMood(mood: string): void;
		playGesture(gesture: string, duration: number, mirror: boolean): void;
	}
} 