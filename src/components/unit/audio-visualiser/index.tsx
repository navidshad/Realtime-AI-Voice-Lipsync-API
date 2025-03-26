import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isMicrophoneMuted: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  analyser,
  isMicrophoneMuted,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current || isMicrophoneMuted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let radius = 16;

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);
      const audioLevel =
        dataArray.reduce((sum, val) => sum + Math.abs(val - 128), 0) /
        (dataArray.length * 128);

      // 🎚️ Super boosted range
      const boostedLevel = Math.min(1, Math.pow(audioLevel * 3.5, 1.7));

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const minRadius = 28;
      const maxRadius = 36;
      const targetRadius = minRadius + (maxRadius - minRadius) * boostedLevel;

      radius += (targetRadius - radius) * 0.85;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Glow gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.9, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(59,130,246, 1)');
      gradient.addColorStop(1, 'rgba(59,130,246, 1)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();
    };

    draw();
  }, [analyser, isMicrophoneMuted]);

  return (
    <canvas
      ref={canvasRef}
      width={80}
      height={80}
      style={{
        borderRadius: '9999px',
        filter: 'blur(3px)',
      }}
    />
  );
};
