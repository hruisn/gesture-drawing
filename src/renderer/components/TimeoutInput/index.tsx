import { hmsStringToMs, msToHmsString } from 'renderer/utils';
import styles from './styles.module.css';

interface TimeoutInputProps {
  min: number;
  max: number;
  timeout: number;
  onChange: (timeout: number) => void;
}

const TimeoutInput: React.FC<TimeoutInputProps> = ({
  min,
  max,
  timeout,
  onChange,
}) => {
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = hmsStringToMs(e.target.value);
    onChange(value >= min && value <= max ? value : timeout);
  };

  return (
    <input
      className={styles.timeoutInput}
      type="time"
      step="1"
      value={msToHmsString(timeout)}
      onChange={onChangeHandler}
    />
  );
};

export default TimeoutInput;
