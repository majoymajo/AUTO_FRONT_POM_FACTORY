import { useState, useEffect } from 'react';

interface UseArchitectureAnimationProps {
  travelDuration?: number;
  idleDuration?: number;
  pathCount?: number;
}

export const useArchitectureAnimation = ({
  travelDuration = 2000,
  idleDuration = 1500,
  pathCount = 5,
}: UseArchitectureAnimationProps = {}) => {
  const [pathIndex, setPathIndex] = useState(0);
  const [status, setStatus] = useState<'TRAVELING' | 'ARRIVED'>('TRAVELING');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTime = Date.now();
    let animationFrame: number;

    const loop = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (status === 'TRAVELING') {
        const p = Math.min(elapsed / travelDuration, 1);
        setProgress(p);
        if (p >= 1) {
          setStatus('ARRIVED');
          startTime = Date.now();
        }
      } else {
        if (elapsed >= idleDuration) {
          setStatus('TRAVELING');
          setPathIndex((prev) => (prev + 1) % pathCount);
          setProgress(0);
          startTime = Date.now();
        }
      }
      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [pathIndex, status, travelDuration, idleDuration, pathCount]);

  const isNodeActive = (nodeId: number) => {
    if (nodeId === 0) return true;
    return pathIndex + 1 === nodeId && status === 'ARRIVED';
  };

  return {
    pathIndex,
    status,
    progress,
    isNodeActive,
  };
};
