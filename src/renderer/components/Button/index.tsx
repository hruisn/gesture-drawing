import cx from 'classnames';
import styles from './styles.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fluid?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type,
  fluid,
  disabled,
  className,
  ...rest
}) => {
  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type || 'button'}
      className={cx(
        styles.button,
        className,
        { [styles.fluid]: fluid },
        { [styles.disabled]: disabled }
      )}
      onClick={disabled ? () => {} : rest.onClick}
      {...rest}
    />
  );
};

export default Button;
