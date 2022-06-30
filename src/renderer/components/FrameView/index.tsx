import { useCallback, useEffect } from 'react';
import cx from 'classnames';
import { useCountDownTimer, useKeyPress } from 'renderer/hooks';
import { msToHmsString } from 'renderer/utils';
import Icon from 'renderer/components/Icon';
import styles from './styles.module.css';

interface FrameViewProps {
  index: number;
  imagePath: string;
  timeout: number;
  onPrev?: () => void;
  onNext?: () => void;
  onFinish: () => void;
  onStop: () => void;
}

const FrameView: React.FC<FrameViewProps> = ({
  index,
  imagePath,
  timeout,
  onPrev,
  onNext,
  onFinish,
  onStop,
}) => {
  const { timeLeft, isRunning, start, pause, resume, reset } =
    useCountDownTimer(timeout, onFinish);

  useEffect(() => {
    start();
    return () => reset();
  }, [imagePath]);

  const pauseHandler = isRunning ? pause : resume;
  const prevHandler = onPrev || (() => {});
  const nextHandler = onNext || (() => {});

  const stopHandler = useCallback(async () => {
    pause();
    const wantsToStop = await window.appApi.confirm('Stop drawing?');
    if (wantsToStop) onStop();
    else resume();
  }, [imagePath, onStop, pause, resume]);

  useKeyPress(pauseHandler, ['Space'], [isRunning]);
  useKeyPress(prevHandler, ['ArrowLeft'], [index]);
  useKeyPress(nextHandler, ['ArrowRight'], [index]);
  useKeyPress(stopHandler, ['Escape']);

  return (
    <div className={styles.frame}>
      <figure className={styles.frameImage}>
        <img src={`file:///${imagePath}`} />
      </figure>
      <div className={styles.controls}>
        <Icon
          name="skip-start"
          className={cx(styles.prev, { [styles.disabled]: !onPrev })}
          onClick={prevHandler}
        />
        <Icon name={isRunning ? 'pause' : 'play'} onClick={pauseHandler} />
        <Icon name="stop" onClick={stopHandler} />
        <Icon
          name="skip-end"
          className={cx(styles.next, { [styles.disabled]: !onNext })}
          onClick={nextHandler}
        />
      </div>
      <div className={styles.timer}>{msToHmsString(timeLeft, true)}</div>;
    </div>
  );
};

export default FrameView;
