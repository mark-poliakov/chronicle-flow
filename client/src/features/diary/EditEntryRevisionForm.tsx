import { useState, type BaseSyntheticEvent } from 'react';
import styles from './EditEntryRevisionForm.module.css';
import { useAppDispatch } from '../../app/hooks';
import { editRecord, endEditingRecord } from './diarySlice';
import Button from '../../components/Button';

interface EditEntryRevisionFormProps {
  currentContent: string,
  entryRevisionId: string,
}

function EditEntryRevisionForm ({ currentContent, entryRevisionId }: EditEntryRevisionFormProps) {
  const [text, setText] = useState<string>(currentContent);
  const dispatch = useAppDispatch();

  const handleTextChange = (event: BaseSyntheticEvent) => {
    setText(event.target.value)
  };
  const handleConfirmChanges = () => {
    dispatch(editRecord({ recordId: entryRevisionId, data: { content: text } }));
    dispatch(endEditingRecord());
  };
  const handleClose = () => {
    dispatch(endEditingRecord());
  }
  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      switch (event.key) {
        case 'Enter':
          handleConfirmChanges();
          break;
        case 'Escape':
          handleClose();
          break;
        default:
      }
    };
  return (
    <>
      <textarea 
        className={styles.form}
        placeholder='How did your day go?..'
        autoFocus={true}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyPress}
        onFocus={(event) => {event.target.selectionStart = event.target.value.length}}
      ></textarea>
      <div className={styles.buttonsWrapper}>
        <div className={styles.buttonWrapper}>
          <Button buttonParameters={{ text: 'Confirm', action: handleConfirmChanges }}/>
        </div>
        <div className={styles.buttonWrapper}>
          <Button buttonParameters={{ text: 'Cancel', action: handleClose }}/>
        </div>
      </div>
    </>
  );
}

export default EditEntryRevisionForm;