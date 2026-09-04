import { useEffect, useState } from 'react';

type WindowSize = {
  width: number;
  height: number;
  isMobile: boolean;
};

function getWindowSize(): WindowSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 600,
  };
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(getWindowSize);

  useEffect(() => {
    function handleResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}
