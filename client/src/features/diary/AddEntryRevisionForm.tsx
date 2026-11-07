import { useState, type BaseSyntheticEvent } from 'react';
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

  return (
    <div className={styles.formWrapper}>
      <textarea className={styles.form} placeholder='How did your day go?..' value={text} onChange={handleTextChange}></textarea>
      <div className={styles.buttonsWrapper}>
        <div className={styles.buttonWrapper}>
          <Button text='Publish' action={() => {handlePublish(text)}}/>
        </div>
        <div className={styles.buttonWrapper}>
          <Button text='Cancel' action={handleClose}/>
        </div>
      </div>
    </div>
  )
}

export default AddEntryRevisionForm;