import React, { useEffect, useRef } from 'react';

export const MouseFire: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      size: number;
      color: string;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initial resize
    resize();
    window.addEventListener('resize', resize);

    const addParticle = (x: number, y: number) => {
        // Fire colors: Red (0) to Yellow (50)
        const hue = Math.random() * 50; 
        
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 1.5, // Slight horizontal spread
            vy: (Math.random() - 2) * 1.5,   // Upward movement
            life: 1.0,
            size: Math.random() * 5 + 3,     // Variable size
            color: `hsla(${hue}, 100%, 50%,` // HSLA base string
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        // Add density by spawning multiple particles per event
        for(let i=0; i<3; i++) {
            addParticle(e.clientX, e.clientY);
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        for(let i=0; i<3; i++) {
            addParticle(touch.clientX, touch.clientY);
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // "Lighter" composite operation creates a glowing effect when particles overlap
        ctx.globalCompositeOperation = 'lighter';

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02 + Math.random() * 0.02; // Random decay
            p.size -= 0.1;

            // Remove dead particles
            if (p.life <= 0 || p.size <= 0) {
                particles.splice(i, 1);
                i--;
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color + p.life + ')';
                ctx.fill();
            }
        }
        
        // Reset composite for any other standard drawing (if needed later)
        ctx.globalCompositeOperation = 'source-over';
        
        animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // z-[9999] ensures it stays on top of the lightbox and other elements
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9999]" />;
};