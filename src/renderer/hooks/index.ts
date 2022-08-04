import { useEffect, useRef, useState, useCallback } from 'react';

interface CountTimerRefProps {
  startedTime: number | null;
  lastInterval: number | null;
  totalTime: number;
  requestId: number | null;
  timeLeft: number;
}

interface CountTimer {
  timeLeft: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

export const useCountDownTimer: (
  totalTime: number,
  onFinish: () => void
) => CountTimer = (totalTime, onFinish) => {
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isRunning, setRunning] = useState(false);

  const initTimer: CountTimerRefProps = {
    startedTime: null,
    lastInterval: null,
    timeLeft: totalTime,
    totalTime,
    requestId: null,
  };

  const timerRef = useRef<CountTimerRefProps>(initTimer);

  const cancelAnimationFrame = useCallback(() => {
    if (timerRef.current.requestId) {
      window.cancelAnimationFrame(timerRef.current.requestId);
    }
  }, []);

  const step = (timeStamp: number) => {
    if (!timerRef.current.startedTime) {
      timerRef.current.startedTime = timeStamp;
      timerRef.current.lastInterval = timeStamp;
    }

    const currentElapsedTime = Math.min(
      1000,
      timerRef.current.timeLeft || Infinity
    );
    if (
      timerRef.current.timeLeft &&
      timerRef.current.lastInterval &&
      currentElapsedTime <= timeStamp - timerRef.current.lastInterval
    ) {
      timerRef.current.lastInterval += currentElapsedTime;
      timerRef.current.timeLeft -= currentElapsedTime;
      setTimeLeft(timerRef.current.timeLeft);
    }

    if (timeStamp - timerRef.current.startedTime < timerRef.current.totalTime) {
      timerRef.current.requestId = window.requestAnimationFrame(step);
    } else {
      timerRef.current = { ...initTimer, timeLeft: 0 };
      setTimeLeft(0);
      setRunning(false);
      onFinish();
    }
  };

  const start = () => {
    setRunning(true);
    cancelAnimationFrame();
    timerRef.current = {
      ...initTimer,
      requestId: window.requestAnimationFrame(step),
    };
  };

  const pause = () => {
    setRunning(false);
    cancelAnimationFrame();
    timerRef.current.startedTime = null;
    timerRef.current.lastInterval = null;
    timerRef.current.totalTime = timerRef.current.timeLeft;
  };

  const resume = () => {
    if (!timerRef.current.startedTime && timerRef.current.timeLeft > 0) {
      setRunning(true);
      cancelAnimationFrame();
      timerRef.current.requestId = window.requestAnimationFrame(step);
    }
  };

  const reset = () => {
    setRunning(false);
    cancelAnimationFrame();
    timerRef.current = { ...initTimer };
    setTimeLeft(totalTime);
  };

  useEffect(() => {
    return () => cancelAnimationFrame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { timeLeft, isRunning, start, resume, pause, reset };
};

export const useKeyPress: (
  cb: () => void,
  keyCodes: string[],
  dependencies?: unknown[]
) => void = (cb, keyCodes, dependencies) => {
  const downHandler = (e: KeyboardEvent) => {
    e.preventDefault();
    if (keyCodes.includes(e.code)) {
      cb();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies || []);
};
