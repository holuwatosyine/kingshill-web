import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
}

export const FluidCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const ripples: Ripple[] = [];
    let mouseX = width / 2;
    let mouseY = height / 2;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;

    const brandColors = [
      'rgba(236, 193, 49, ',  // Gold
      'rgba(184, 29, 29, ',   // Red
      'rgba(29, 138, 78, ',   // Emerald
    ];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const dx = clientX - prevMouseX;
      const dy = clientY - prevMouseY;
      const dist = Math.hypot(dx, dy);

      if (dist > 2) {
        const colorBase = brandColors[Math.floor(Math.random() * brandColors.length)];
        ripples.push({
          x: clientX,
          y: clientY,
          vx: dx * 0.15 + (Math.random() - 0.5) * 2,
          vy: dy * 0.15 + (Math.random() - 0.5) * 2,
          size: Math.min(30 + dist * 0.8, 90),
          color: colorBase,
          alpha: 0.35,
          maxAlpha: 0.35,
          life: 0,
          maxLife: 45 + Math.random() * 20,
        });
      }

      prevMouseX = clientX;
      prevMouseY = clientY;
      mouseX = clientX;
      mouseY = clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.life += 1;
        r.x += r.vx;
        r.y += r.vy;
        r.vx *= 0.95;
        r.vy *= 0.95;
        r.size += 0.8;

        const progress = r.life / r.maxLife;
        r.alpha = r.maxAlpha * (1 - progress);

        if (progress >= 1) {
          ripples.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, r.size);
        grad.addColorStop(0, `${r.color}${r.alpha})`);
        grad.addColorStop(0.5, `${r.color}${r.alpha * 0.4})`);
        grad.addColorStop(1, `${r.color}0)`);

        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw cursor core glow pointer
      const coreGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 16);
      coreGrad.addColorStop(0, 'rgba(236, 193, 49, 0.8)');
      coreGrad.addColorStop(1, 'rgba(236, 193, 49, 0)');
      ctx.beginPath();
      ctx.fillStyle = coreGrad;
      ctx.arc(mouseX, mouseY, 16, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 mix-blend-screen"
      style={{ opacity: 0.85 }}
    />
  );
};

export default FluidCursor;
