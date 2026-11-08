import { useAppSelector } from '../../app/hooks';
import { ConvertTimeToDate } from '../../utils/utils';
import styles from './RevisionHistory.module.css';

function RevisionHistory () {
  const entryRevisions = useAppSelector((state) => state.diary.entryRevisions);

  return (
    <ul className={styles.container}>
      {entryRevisions.map((item) => {
        return (
          <li className={styles.item}>
            <p className={styles.shortContent}>{item.content.slice(0, 30).trimEnd() + '...'}</p>
            <span className={styles.timeMarker}>{ConvertTimeToDate(item.createdAt)}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default RevisionHistory;