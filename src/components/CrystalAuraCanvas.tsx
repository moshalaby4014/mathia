import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  fadeSpeed: number;
  rotation: number;
  vRot: number;
  shape: 'star' | 'circle' | 'diamond';
}

interface Props {
  colorTheme?: 'emerald' | 'amber' | 'purple' | 'gold';
  className?: string;
}

export const CrystalAuraCanvas: React.FC<Props> = ({
  colorTheme = 'emerald',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 300);
    let height = (canvas.height = canvas.offsetHeight || 300);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 300;
      height = canvas.height = canvas.offsetHeight || 300;
    };
    window.addEventListener('resize', handleResize);

    const colorPalettes = {
      emerald: ['#10b981', '#34d399', '#6ee7b7', '#fef08a', '#ffffff'],
      amber: ['#f59e0b', '#fbbf24', '#fde68a', '#fb7185', '#ffffff'],
      purple: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#38bdf8', '#ffffff'],
      gold: ['#fbbf24', '#fef08a', '#ffffff', '#f59e0b', '#f43f5e'],
    };

    const palette = colorPalettes[colorTheme] || colorPalettes.emerald;

    const particles: Particle[] = [];
    const MAX_PARTICLES = 32;

    const createParticle = (): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 1.2;
      const shapes: ('star' | 'circle' | 'diamond')[] = ['star', 'circle', 'diamond'];

      return {
        x: width / 2 + (Math.random() - 0.5) * 60,
        y: height / 2 + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.3, // float slightly upward
        size: 3 + Math.random() * 5,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 0.1 + Math.random() * 0.8,
        fadeSpeed: 0.006 + Math.random() * 0.012,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.05,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      };
    };

    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push(createParticle());
    }

    const drawDiamond = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      rot: number,
      col: string,
      alpha: number
    ) => {
      context.save();
      context.translate(cx, cy);
      context.rotate(rot);
      context.beginPath();
      context.moveTo(0, -size);
      context.lineTo(size * 0.7, 0);
      context.lineTo(0, size);
      context.lineTo(-size * 0.7, 0);
      context.closePath();
      context.fillStyle = col;
      context.globalAlpha = alpha;
      context.shadowColor = col;
      context.shadowBlur = 8;
      context.fill();
      context.restore();
    };

    const drawStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number,
      rot: number,
      col: string,
      alpha: number
    ) => {
      context.save();
      context.translate(cx, cy);
      context.rotate(rot);
      context.beginPath();
      let rotStep = (Math.PI / spikes);
      let angle = -Math.PI / 2;

      for (let i = 0; i < spikes; i++) {
        context.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
        angle += rotStep;
        context.lineTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
        angle += rotStep;
      }
      context.closePath();
      context.fillStyle = col;
      context.globalAlpha = alpha;
      context.shadowColor = col;
      context.shadowBlur = 10;
      context.fill();
      context.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= p.fadeSpeed;

        if (p.alpha <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          particles[i] = createParticle();
        } else {
          if (p.shape === 'star') {
            drawStar(ctx, p.x, p.y, 4, p.size, p.size * 0.45, p.rotation, p.color, p.alpha);
          } else if (p.shape === 'diamond') {
            drawDiamond(ctx, p.x, p.y, p.size, p.rotation, p.color, p.alpha);
          } else {
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colorTheme]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none select-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
