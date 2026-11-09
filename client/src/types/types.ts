export type Entry = {
  id: string,
  targetDate: string,
  createdAt: EpochTimeStamp,
  updatedAt: EpochTimeStamp,
}

export type EntryRevision = {
  id: string,
  entryId: string,
  content: string,
  createdAt: EpochTimeStamp,
  updatedAt: EpochTimeStamp,
}