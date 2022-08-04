import React, { useState } from 'react';
import { Session } from './types';
import FrameView from './components/FrameView';
import SessionView from './components/SessionView';

const App: React.FC = () => {
  const [isStarted, setStarted] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const isActive = session && activeImageIndex !== null;

  const canSwitchToNext =
    isActive && activeImageIndex < session.imagePaths.length - 1;

  const canSwitchToPrev = isActive && activeImageIndex > 0;

  const start = (s: Session, index: number) => {
    setSession(s);
    setActiveImageIndex(index);
    setStarted(true);
  };

  const onStart = (s: Session) => start(s, 0);
  const onResume = (s: Session) => start(s, activeImageIndex || 0);
  const onStop = () => setStarted(false);
  const onPrev = () =>
    canSwitchToPrev && setActiveImageIndex(activeImageIndex - 1);

  const onNext = () =>
    canSwitchToNext && setActiveImageIndex(activeImageIndex + 1);

  const onFinishFrame = () => {
    if (isActive) {
      if (canSwitchToNext) {
        onNext();
      } else {
        onStop();
      }
    }
  };

  if (isActive && isStarted) {
    return (
      <FrameView
        index={activeImageIndex}
        imagePath={session.imagePaths[activeImageIndex]}
        timeout={session.timeout}
        onPrev={canSwitchToPrev ? onPrev : undefined}
        onNext={canSwitchToNext ? onNext : undefined}
        onFinish={onFinishFrame}
        onStop={onStop}
      />
    );
  }
  return (
    <SessionView
      session={session}
      onStart={onStart}
      onResume={isActive && canSwitchToPrev ? onResume : undefined}
    />
  );
};

export default App;
