import { useEffect, useRef } from "react";

interface SubCircle {
  offsetX: number;
  offsetY: number;
  radius: number;
  vx: number;
  vy: number;
  angle: number;
  orbitSpeed: number;
}

interface Circle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  color: string;
  behavior: 'attract' | 'repel' | 'orbit' | 'shy' | 'curious';
  subCircles: SubCircle[];
}

export const GradientCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const circlesRef = useRef<Circle[]>([]);
  const scaleRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      // Render at lower internal resolution for performance, scale visually via CSS
      const perfScale = window.devicePixelRatio > 1 ? 0.5 : 0.75;
      scaleRef.current = perfScale;
      canvas.width = Math.max(1, Math.floor(window.innerWidth * perfScale));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * perfScale));
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize mouse to center so orbs have a reference point
    mouseRef.current = { x: canvas.width / 2, y: canvas.height / 2 };

    const colors = [
      "rgba(168, 85, 247, 0.95)", // purple
      "rgba(236, 72, 153, 0.95)", // pink
      "rgba(6, 182, 212, 0.95)",  // cyan
      "rgba(59, 130, 246, 0.95)", // blue
      "rgba(251, 146, 60, 0.95)", // orange
    ];

    const behaviors: Array<'attract' | 'repel' | 'orbit' | 'shy' | 'curious'> = ['attract', 'repel', 'orbit', 'shy', 'curious'];

    circlesRef.current = Array.from({ length: 3 }, (_, i) => {
      const subCircleCount = 4 + Math.floor(Math.random() * 3);
      const subCircles: SubCircle[] = Array.from({ length: subCircleCount }, () => ({
        offsetX: (Math.random() - 0.5) * 80,
        offsetY: (Math.random() - 0.5) * 80,
        radius: 24 + Math.random() * 32,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        angle: Math.random() * Math.PI * 2,
        orbitSpeed: (Math.random() - 0.5) * 0.015,
      }));

      return {
        x: (canvas.width / 4) * (i + 1),
        y: (canvas.height / 2) + (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        baseRadius: 160 + Math.random() * 80,
        color: colors[i],
        behavior: behaviors[i],
        subCircles,
      };
    });

    const handlePointerMove = (e: PointerEvent) => {
      const s = scaleRef.current;
      mouseRef.current = { x: e.clientX * s, y: e.clientY * s };
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length) {
        const t = e.touches[0];
        const s = scaleRef.current;
        mouseRef.current = { x: t.clientX * s, y: t.clientY * s };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    let animationId: number;
    const animate = () => {
      // Set composite operation to ensure transparency
      ctx.globalCompositeOperation = 'source-over';
      
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Ensure the canvas remains transparent
      ctx.globalCompositeOperation = 'source-over';

      // Lower blur for performance
      ctx.filter = "blur(24px)";

      circlesRef.current.forEach((circle) => {
        const dx = mouseRef.current.x - circle.x;
        const dy = mouseRef.current.y - circle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const normalizedDx = dx / (distance || 1);
        const normalizedDy = dy / (distance || 1);

        // Increase response for clearer visual reaction
        const reactStrength = Math.min(360 / (distance + 1), 2.2);
        switch (circle.behavior) {
          case 'attract':
            circle.vx += normalizedDx * reactStrength * 0.10;
            circle.vy += normalizedDy * reactStrength * 0.10;
            break;
          case 'repel':
            circle.vx -= normalizedDx * reactStrength * 0.16;
            circle.vy -= normalizedDy * reactStrength * 0.16;
            break;
          case 'orbit':
            circle.vx += -normalizedDy * reactStrength * 0.14;
            circle.vy += normalizedDx * reactStrength * 0.14;
            break;
          case 'shy':
            if (distance < 320) {
              circle.vx -= normalizedDx * reactStrength * 0.18;
              circle.vy -= normalizedDy * reactStrength * 0.18;
            }
            break;
          case 'curious':
            if (distance > 220) {
              circle.vx += normalizedDx * reactStrength * 0.10;
              circle.vy += normalizedDy * reactStrength * 0.10;
            } else {
              circle.vx -= normalizedDx * reactStrength * 0.06;
              circle.vy -= normalizedDy * reactStrength * 0.06;
            }
            break;
        }

        // Subtle autonomous drift
        circle.vx += (Math.random() - 0.5) * 0.05;
        circle.vy += (Math.random() - 0.5) * 0.05;

        circle.vx *= 0.95;
        circle.vy *= 0.95;

        circle.x += circle.vx;
        circle.y += circle.vy;

        if (circle.x < -circle.baseRadius) circle.x = canvas.width + circle.baseRadius;
        if (circle.x > canvas.width + circle.baseRadius) circle.x = -circle.baseRadius;
        if (circle.y < -circle.baseRadius) circle.y = canvas.height + circle.baseRadius;
        if (circle.y > canvas.height + circle.baseRadius) circle.y = -circle.baseRadius;

        circle.subCircles.forEach((sub) => {
          sub.angle += sub.orbitSpeed;
          sub.vx += (Math.random() - 0.5) * 0.2;
          sub.vy += (Math.random() - 0.5) * 0.2;
          sub.vx *= 0.92;
          sub.vy *= 0.92;

          const distFromCenter = Math.sqrt(sub.offsetX * sub.offsetX + sub.offsetY * sub.offsetY);
          if (distFromCenter > 120) {
            sub.offsetX *= 0.985;
            sub.offsetY *= 0.985;
          }

          sub.offsetX += sub.vx + Math.cos(sub.angle) * 0.5;
          sub.offsetY += sub.vy + Math.sin(sub.angle) * 0.5;

          const gradient = ctx.createRadialGradient(
            circle.x + sub.offsetX,
            circle.y + sub.offsetY,
            0,
            circle.x + sub.offsetX,
            circle.y + sub.offsetY,
            sub.radius
          );
          gradient.addColorStop(0, circle.color);
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(circle.x + sub.offsetX, circle.y + sub.offsetY, sub.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      ctx.filter = "none";

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove as any);
      window.removeEventListener("touchmove", handleTouchMove as any);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    // Make body transparent when canvas is mounted
    const originalBackground = document.body.style.backgroundColor;
    document.body.style.backgroundColor = 'transparent';
    
    return () => {
      // Restore original background when unmounted
      document.body.style.backgroundColor = originalBackground;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ 
        position: 'fixed', 
        inset: 0, 
        width: '100%', 
        height: '100%', 
        touchAction: 'none', 
        zIndex: 0, 
        pointerEvents: 'none',
        background: 'transparent'
      }}
    />
  );
};
