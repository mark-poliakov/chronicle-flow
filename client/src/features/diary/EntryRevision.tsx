import type { MouseEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { EntryRevision as EntryRevisionType } from '../../types/types'
import { ConvertTimeToDate } from '../../utils/utils';
import { selectRecord } from './diarySlice';
import styles from './EntryRevision.module.css';

interface EntryRevisionProps {
  entryRevision: EntryRevisionType,
}

function EntryRevision({ entryRevision }: EntryRevisionProps) {
  const selectedRecordId = useAppSelector((state) => state.diary.recordSelectedId);
  const isSelected = selectedRecordId === entryRevision.id;
  const isRecordBeingEdited = useAppSelector((state) => state.diary.isRecordBeingEdited);
  const containerStyle = `${styles.container} ${isSelected ? styles.selected : ''}`;

  const dispatch = useAppDispatch();
  const selectThisRecord = () => {
    if (isSelected) {
      return;
    }
    dispatch(selectRecord({ id: entryRevision.id }));
  }
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    selectThisRecord();
  }

  return (
    <output className={containerStyle} tabIndex={0} onFocus={selectThisRecord} onClick={handleClick} id={entryRevision.id}>
      <span className={styles.timeMarker}>
        {ConvertTimeToDate(entryRevision.createdAt)}
        {entryRevision.createdAt === entryRevision.updatedAt ? 
          ''
          :
          <span className={styles.editTimeMarker}>{`(Edited ${ConvertTimeToDate(entryRevision.updatedAt)})`}</span> 
        }
      </span>
      {isSelected && isRecordBeingEdited ? (
        <p>Being edited...</p>
      ) : (
        <p className={styles.text}>
          {entryRevision.content}
        </p>
      )}
    </output>
  )
}

export default EntryRevision;