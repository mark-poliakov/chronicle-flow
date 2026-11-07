export type Entry = {
  id: string,
  targetDate: string,
  createdAt: EpochTimeStamp,
}

export type EntryRevision = {
  id: string,
  entryId: string,
  content: string,
  revisionType: 'INITIAL' | 'INITIAL_DEPRECATED' | 'RETROSPECTIVE_EDIT',
  createdAt: EpochTimeStamp,
}