'use client';

import { useEffect, useRef } from 'react';

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#0a4b6e');
      gradient.addColorStop(0.4, '#1a7a9e');
      gradient.addColorStop(0.7, '#2aaacf');
      gradient.addColorStop(1, '#4ac8e8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      time += 0.008;

      // 绘制多层波浪
      const waves = [
        { amplitude: 30, frequency: 0.02, speed: 0.8, color: 'rgba(255,255,255,0.15)', yOffset: 0 },
        { amplitude: 45, frequency: 0.025, speed: 0.6, color: 'rgba(255,255,255,0.10)', yOffset: 30 },
        { amplitude: 25, frequency: 0.03, speed: 1.0, color: 'rgba(255,255,255,0.08)', yOffset: 60 },
        { amplitude: 50, frequency: 0.015, speed: 0.4, color: 'rgba(255,255,255,0.05)', yOffset: 90 },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, height * 0.6 + wave.yOffset);
        for (let x = 0; x <= width; x += 2) {
          const y = height * 0.6 + wave.yOffset +
            Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
            Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 0.7 + 2) * wave.amplitude * 0.5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      // 添加光晕
      const glow = ctx.createRadialGradient(width * 0.3, height * 0.2, 0, width * 0.3, height * 0.2, width * 0.8);
      glow.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      glow.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)');
      glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}
