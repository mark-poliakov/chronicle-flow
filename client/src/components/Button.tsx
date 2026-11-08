import type { MouseEventHandler } from 'react';
import styles from './Button.module.css'

interface ButtonProps {
  text: string,
  action: MouseEventHandler,
  width?: string,
  height?: string,
  disabled?: boolean,
}

function Button({ text, action, width = 'auto', height = 'auto', disabled = false }: ButtonProps) {
  return (
    <button
      className={styles.button}
      onClick={action}
      style={{ width, height }}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

export default Button;