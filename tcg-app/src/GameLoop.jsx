import { useEffect, useRef } from 'react';

export function useGameLoop(callback) {
  const frameRef = useRef(null);
  
  useEffect(() => {
    const animate = () => {
      callback();
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(frameRef.current);
  }, [callback]);
}

export function createParticle(x, y, text, color = '#ffff00') {
  const particle = document.createElement('div');
  particle.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: 24px;
    font-weight: bold;
    color: ${color};
    pointer-events: none;
    z-index: 9999;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    font-family: 'Courier New', monospace;
  `;
  particle.textContent = text;
  document.body.appendChild(particle);
  
  let time = 0;
  const duration = 800;
  const animate = () => {
    time += 16;
    const progress = time / duration;
    particle.style.transform = `translate(-50%, -${progress * 80}px)`;
    particle.style.opacity = 1 - progress;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      particle.remove();
    }
  };
  requestAnimationFrame(animate);
}

export function screenShake(intensity = 5, duration = 100) {
  const root = document.getElementById('root');
  if (!root) return;
  
  let time = 0;
  const animate = () => {
    time += 16;
    const progress = time / duration;
    const shake = Math.sin(time / 20) * intensity * (1 - progress);
    root.style.transform = `translateX(${shake}px)`;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      root.style.transform = 'translateX(0)';
    }
  };
  requestAnimationFrame(animate);
}
