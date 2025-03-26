import { useEffect, useState } from "react";



export const useAudioVisualiser = (microphoneTrackRef: React.RefObject<MediaStreamTrack | null>) => {
    const [audioAnalyser, setAudioAnalyser] = useState<AnalyserNode | null>(null);

    // 👇 useEffect to watch when microphoneTrackRef becomes available
    useEffect(() => {
        const setupAnalyserFromMicTrack = async () => {
        if (!microphoneTrackRef?.current) return;

        const audioContext = new AudioContext();
        await audioContext.resume();

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.85;

        // Create a MediaStream from the single track
        const stream = new MediaStream([microphoneTrackRef.current]);

        // Connect stream to analyser
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        setAudioAnalyser(analyser);
        };

        setupAnalyserFromMicTrack();
    }, [microphoneTrackRef?.current]); // re-run if mic track is set

    // 🔁 Visualizer loop
    useEffect(() => {
        if (!audioAnalyser) return;

        const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
        let animationFrameId: number;

        const tick = () => {
        audioAnalyser.getByteTimeDomainData(dataArray);
        animationFrameId = requestAnimationFrame(tick);
        };

        tick();

        return () => cancelAnimationFrame(animationFrameId);
    }, [audioAnalyser]);

    return { audioAnalyser };
}