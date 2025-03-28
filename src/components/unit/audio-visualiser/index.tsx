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
    if (!analyser || !canvasRef.current) return;

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
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={80}
        height={80}
        style={{
          borderRadius: '9999px',
          filter: 'blur(8px)',
        }}
      />
      {/* <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1 flex items-center justify-center"
        style={{
          width: '60%',
          aspectRatio: '1',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="38 35 101 67" fill="none" className="animate-fade-in mb-1">
          <g>
            <path fillRule="evenodd" clipRule="evenodd" d="M38 83.6962C38 69.4105 49.9047 65.3289 56.3673 65.3289C56.9342 57.6191 64.5305 41.2236 81.8774 38.4582C100.653 35.465 111.356 47.8686 114.871 54.4445C123.374 54.4445 138.68 60.567 138.68 79.2744C138.68 94.9206 124.394 100.136 117.251 101.043H52.6258C47.5238 100.703 38 94.2403 38 83.6962ZM115.211 69.8042C115.211 85.208 102.723 97.6953 87.3195 97.6953C71.9157 97.6953 59.4284 85.208 59.4284 69.8042C59.4284 54.4004 71.9157 41.9131 87.3195 41.9131C102.723 41.9131 115.211 54.4004 115.211 69.8042ZM84.259 59.3855L73.8398 69.8047L84.259 80.2239L81.6542 82.8287L68.6302 69.8047L81.6542 56.7807L84.259 59.3855ZM90.3797 59.3855L100.799 69.8047L90.3797 80.2239L92.9845 82.8287L106.008 69.8047L92.9845 56.7807L90.3797 59.3855Z" fill="url(#paint0_linear_52_1184)"/>
          </g>
          <defs>
            <linearGradient id="paint0_linear_52_1184" x1="134.993" y1="38" x2="59.4125" y2="113.378" gradientUnits="userSpaceOnUse">
              <stop stopColor="#95E4B7"/>
              <stop offset="0.483932" stopColor="#10C1DF"/>
              <stop offset="1" stopColor="#1C88D6"/>
            </linearGradient>
          </defs>
        </svg>
      </div> */}
    </div>
  );
};
