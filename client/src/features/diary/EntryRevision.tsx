import type { EntryRevision as EntryRevisionType } from '../../types/types'
import styles from './EntryRevision.module.css';

interface EntryRevisionProps {
  entryRevision: EntryRevisionType,
}

function EntryRevision({ entryRevision }: EntryRevisionProps) {
  const className = entryRevision.revisionType === 'RETROSPECTIVE_EDIT' ? styles.retrospective : '';
  return (
    <p className={className}>
      {entryRevision.content}
    </p>
  )
}

export default EntryRevision;