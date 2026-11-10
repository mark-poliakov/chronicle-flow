import { useState, type BaseSyntheticEvent, type KeyboardEvent } from 'react';
import styles from './AddEntryRevisionForm.module.css';
import Button from '../../components/Button';

interface AddEntryRevisionFormProps {
  handleClose: () => void,
  handlePublish: (text: string) => void,
} 

function AddEntryRevisionForm ({ handleClose, handlePublish }: AddEntryRevisionFormProps) {
  const [text, setText] = useState<string>('');

  const handleTextChange = (event: BaseSyntheticEvent) => {
    setText(event.target.value);
  };
  const handleKeyPress = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        handlePublish(text);
        break;
      case 'Escape':
        handleClose();
        break;
      default:
    }
  };

  return (
    <div className={styles.formWrapper}>
      <textarea 
        className={styles.form}
        placeholder='How did your day go?..'
        autoFocus={true}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyPress}
      ></textarea>
      <div className={styles.buttonsWrapper}>
        <div className={styles.buttonWrapper}>
          <Button buttonParameters={{ text: 'Publish', action: () => {handlePublish(text)} }}/>
        </div>
        <div className={styles.buttonWrapper}>
          <Button buttonParameters={{ text: 'Cancel', action: handleClose }}/>
        </div>
      </div>
    </div>
  )
}

export default AddEntryRevisionForm;