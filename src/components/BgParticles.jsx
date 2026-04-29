import { useEffect, useRef } from 'react';

export default function BgParticles({ colorTheme }) {
  const canvasRef = useRef(null);
  const themeRef = useRef(colorTheme);

  useEffect(() => { themeRef.current = colorTheme; }, [colorTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.004 + 0.001,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.5 ? 320 : 270, // pink or purple
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const t = Date.now() / 1000;
      const dark = themeRef.current === 'dark';

      pts.forEach(p => {
        const a = (0.08 + 0.18 * (0.5 + 0.5 * Math.sin(t * p.speed * 25 + p.phase))) * (dark ? 1 : 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${a})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
  );
}
