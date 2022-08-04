interface IconProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  name: 'play' | 'pause' | 'stop' | 'skip-start' | 'skip-end';
}

const Icon: React.FC<IconProps> = ({ name, ...rest }) => {
  switch (name) {
    case 'play': {
      return (
        <svg
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
          {...rest}
        >
          <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
        </svg>
      );
    }

    case 'pause': {
      return (
        <svg
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
          {...rest}
        >
          <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
        </svg>
      );
    }
    case 'stop': {
      return (
        <svg
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
          {...rest}
        >
          <path d="M3.5 5A1.5 1.5 0 0 1 5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5zM5 4.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5H5z" />
        </svg>
      );
    }
    case 'skip-start': {
      return (
        <svg
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
          {...rest}
        >
          <path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.52-.302 1.233.043 1.233.696v7.384c0 .653-.713.998-1.233.696L5 8.752V12a.5.5 0 0 1-1 0V4zm7.5.633L5.696 8l5.804 3.367V4.633z" />
        </svg>
      );
    }
    case 'skip-end': {
      return (
        <svg
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
          {...rest}
        >
          <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.713 3.31 4 3.655 4 4.308v7.384c0 .653.713.998 1.233.696L11.5 8.752V12a.5.5 0 0 0 1 0V4zM5 4.633 10.804 8 5 11.367V4.633z" />
        </svg>
      );
    }

    default:
      return null;
  }
};

export default Icon;
