import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Entry, EntryRevision } from "../../types/types";
import { getLocalDateString } from "../../utils/utils";

// temporary static data
const entries: Record<string, Entry> = {
  '2026-11-06': { id: '1', targetDate: getLocalDateString(new Date(2026, 10, 6)), createdAt: Date.UTC(2026, 10, 6) },
  '2026-11-05': { id: '2', targetDate: getLocalDateString(new Date(2026, 10, 5)), createdAt: Date.UTC(2026, 10, 5) },
  '2026-11-07': { id: '3', targetDate: getLocalDateString(new Date(2026, 10, 7)), createdAt: Date.UTC(2026, 10, 7) },
  '2026-11-08': { id: '4', targetDate: getLocalDateString(new Date(2026, 10, 7)), createdAt: Date.UTC(2026, 10, 7) },
}
const entryRevisions: EntryRevision[] = [
  { id: '1', entryId: '3', content: 'This is an entry revision', createdAt: Date.UTC(2026, 10, 7), updatedAt: Date.UTC(2026, 10, 7) },
  { id: '2', entryId: '3', content: 'This is another entry revision', createdAt: Date.UTC(2026, 10, 7), updatedAt: Date.UTC(2026, 10, 7) },
];
const dateSelectedInitial = getLocalDateString();

interface DiaryState {
  dateSelected: string,
  entries: Record<string, Entry>,
  entryRevisions: EntryRevision[],
}

const initialState: DiaryState = {
  dateSelected: dateSelectedInitial,
  entries: entries,
  entryRevisions: entries[dateSelectedInitial] ? entryRevisions.filter((entryRevision) => entryRevision.entryId === entries[dateSelectedInitial].id) : [],
};

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    setDate: (state, action: PayloadAction<{dateString: string}>) => {
      if (!action.payload) {
        return;
      }
      state.dateSelected = action.payload.dateString;
      console.log(state.dateSelected);
      console.log(entries);
      const existingEntry = state.entries[action.payload.dateString];
      if (existingEntry) {
        state.entryRevisions = entryRevisions.filter((entryRevision) => entryRevision.entryId === existingEntry.id);
      } else {
        state.entryRevisions = [];
      }
    },
    createRecord: (state, action: PayloadAction<{content: string}>) => {
      if (!action.payload) {
        return;
      }
      const existingEntry = state.entries[state.dateSelected];
      let entryId;
      if (!existingEntry) {
        entryId = Date.now().toString();
        state.entries[getLocalDateString()] = ({
          id: entryId,
          targetDate: state.dateSelected,
          createdAt: Date.now(),
        }) 
      } else {
        entryId = existingEntry.id;
      }

      const newEntryRevision: EntryRevision = {
        id: Date.now().toString(),
        entryId,
        content: action.payload.content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      entryRevisions.push(newEntryRevision);
      state.entryRevisions.push(newEntryRevision);
    },
    editRecord: (state, action: PayloadAction<{id: string, content: string}>) => {
      const recordIndex = state.entryRevisions.findIndex((record) => record.id === action.payload.id);
      if (recordIndex === -1) {
        return;
      }
      state.entryRevisions[recordIndex].content = action.payload.content;
    },
    deleteRecord: (state, action: PayloadAction<{id: string}>) => {
      const recordIndex = state.entryRevisions.findIndex((record) => record.id === action.payload.id);
      if (recordIndex === -1) {
        return;
      }
      entryRevisions.splice(recordIndex, 1);
      state.entryRevisions = entryRevisions.filter((entryRevision) => entryRevision.entryId === entries[state.dateSelected].id);
      if (state.entryRevisions.length < 1) {
        delete entries[state.dateSelected];
        state.entries = entries;
      }
    },
  }
});

export const { setDate, createRecord, editRecord, deleteRecord } = diarySlice.actions;
export default diarySlice.reducer;