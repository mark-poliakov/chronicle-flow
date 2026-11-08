import { useAppSelector } from '../../app/hooks';
import { ConvertTimeToDate } from '../../utils/utils';
import styles from './RevisionHistory.module.css';

function RevisionHistory () {
  const entryRevisions = useAppSelector((state) => state.diary.entryRevisions);
  const recordSelectedId = useAppSelector((state) => state.diary.recordSelectedId);

  return (
    <ul className={styles.container}>
      {entryRevisions.map((item) => {
        return (
          <li className={styles.item} key={item.id} onClick={(event) => {event.stopPropagation()}}>
            <label
              className={`${styles.labelWrapper} ${recordSelectedId === item.id ? styles.selected : ''}`}
              htmlFor={item.id}
            >
              <p className={styles.shortContent}>{item.content.slice(0, 30).trimEnd() + '...'}</p>
              <span className={styles.timeMarker}>{ConvertTimeToDate(item.createdAt)}</span>
            </label>
          </li>
        )
      })}
    </ul>
  )
}

export default RevisionHistory;