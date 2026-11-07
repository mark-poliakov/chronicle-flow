import styles from './Button.module.css'

interface ButtonProps {
  text: string,
  action: () => void,
  width?: string,
  height?: string,
}

function Button({ text, action, width = 'auto', height = 'auto' }: ButtonProps) {
  return (
    <button
      className={styles.button}
      onClick={action}
      style={{ width, height }}
    >
      {text}
    </button>
  )
}

export default Button;