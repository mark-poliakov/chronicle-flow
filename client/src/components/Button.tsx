import styles from './Button.module.css'
import type { ButtonParameters } from '../types/types';

interface ButtonProps {
  buttonParameters: ButtonParameters,
}

function Button({ buttonParameters }: ButtonProps) {
  return (
    <button
      className={styles.button}
      onClick={buttonParameters.action}
      style={{ width: buttonParameters.width, height: buttonParameters.height }}
      disabled={buttonParameters.disabled}
    >
      {buttonParameters.text}
    </button>
  )
}

export default Button;