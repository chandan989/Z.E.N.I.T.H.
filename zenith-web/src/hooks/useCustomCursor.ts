
import { useEffect, useRef } from "react";

export const useCustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const tailCount = 15;
    const tailParticles: Array<{element: HTMLDivElement, x: number, y: number}> = [];
    let mouseX = -100;
    let mouseY = -100;
    let lastTime = 0;
    let animationFrameId: number;

    const tailContainer = document.createElement('div');
    document.body.appendChild(tailContainer);

    for (let i = 0; i < tailCount; i++) {
        const particleEl = document.createElement('div');
        particleEl.style.position = 'fixed';
        particleEl.style.borderRadius = '50%';
        particleEl.style.pointerEvents = 'none';
        particleEl.style.zIndex = '9998';
        particleEl.style.backgroundColor = `rgba(56, 189, 248, ${0.5 - i * 0.03})`; // Fading opacity
        tailContainer.appendChild(particleEl);
        tailParticles.push({ element: particleEl, x: -100, y: -100 });
    }

    const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    const animateTail = (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        if (cursor) {
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        }

        let prevX = mouseX;
        let prevY = mouseY;

        tailParticles.forEach((particle, index) => {
            const speed = 1.0 - (index / tailCount) * 0.3;
            const newX = particle.x + (prevX - particle.x) * speed * (deltaTime / 40);
            const newY = particle.y + (prevY - particle.y) * speed * (deltaTime / 40);

            const size = Math.max(1, 8 - index * 0.5);
            particle.element.style.width = `${size}px`;
            particle.element.style.height = `${size}px`;
            particle.element.style.left = `${newX - size / 2}px`;
            particle.element.style.top = `${newY - size / 2}px`;

            particle.x = newX;
            particle.y = newY;
            prevX = newX;
            prevY = newY;
        });

        animationFrameId = requestAnimationFrame(animateTail);
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLAnchorElement ||
        e.target instanceof HTMLButtonElement ||
        e.target instanceof HTMLInputElement
      ) {
        cursor?.classList.add("hover");
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLAnchorElement ||
        e.target instanceof HTMLButtonElement ||
        e.target instanceof HTMLInputElement
      ) {
        cursor?.classList.remove("hover");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseout", handleMouseOut);
    
    animationFrameId = requestAnimationFrame(animateTail);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
      document.body.removeChild(tailContainer);
    };
  }, []);

  return cursorRef;
};
