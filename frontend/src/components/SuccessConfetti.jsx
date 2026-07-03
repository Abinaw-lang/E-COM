import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const SuccessConfetti = ({ active }) => {
  useEffect(() => {
    if (!active) return;

    const end = Date.now() + 1500;
    const colors = ['#6fc2ff', '#ef3340', '#ffffff', '#3a6bff'];

    const frame = () => {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [active]);

  return null;
};

export default SuccessConfetti;
