import type { EntryRevision as EntryRevisionType } from '../../types/types'
import styles from './EntryRevision.module.css';

interface EntryRevisionProps {
  entryRevision: EntryRevisionType,
}

function EntryRevision({ entryRevision }: EntryRevisionProps) {
  return (
    <p className={styles.text}>
      {entryRevision.content}
    </p>
  )
}

export default EntryRevision;