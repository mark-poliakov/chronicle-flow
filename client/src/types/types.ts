import type { MouseEventHandler } from "react"

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

export type ButtonParameters = {
  text: string,
  action: MouseEventHandler,
  width?: string,
  height?: string,
  disabled?: boolean,
}

export type ModalParameters = {
  name: string,
  heading?: string,
  message?: string,
  options: ButtonParameters[],
}