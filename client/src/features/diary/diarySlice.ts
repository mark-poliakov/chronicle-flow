import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Entry, EntryRevision } from "../../types/types";
import { getLocalDateString } from "../../utils/utils";

// temporary static data
let entries: Record<string, Entry | null> = {
  '2026-11-06': { id: '1', targetDate: '2026-11-06', createdAt: Date.UTC(2026, 10, 6) },
  '2026-11-05': { id: '2', targetDate: '2026-11-05', createdAt: Date.UTC(2026, 10, 5) },
  '2026-11-07': { id: '3', targetDate: '2026-11-07', createdAt: Date.UTC(2026, 10, 7) },
  '2026-11-08': { id: '4', targetDate: '2026-11-08', createdAt: Date.UTC(2026, 10, 7) },
}
let entryRevisions: EntryRevision[] = [
  { id: '1', entryId: '3', content: 'This is an entry revision', createdAt: Date.UTC(2026, 10, 7), updatedAt: Date.UTC(2026, 10, 7) },
  { id: '2', entryId: '3', content: 'This is another entry revision', createdAt: Date.UTC(2026, 10, 7), updatedAt: Date.UTC(2026, 10, 7) },
];
const dateSelectedInitial = getLocalDateString();

interface DiaryState {
  dateSelected: string,
  recordSelectedId: string | null,
  entries: Record<string, Entry | null>,
  entryRevisions: EntryRevision[],
}

const initialState: DiaryState = {
  dateSelected: dateSelectedInitial,
  recordSelectedId: null,
  entries: entries,
  entryRevisions: entries[dateSelectedInitial] !== null ? entryRevisions.filter((entryRevision) => entryRevision.entryId === entries[dateSelectedInitial]!.id) : [],
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
      state.recordSelectedId = null;
    },
    selectRecord: (state, action: PayloadAction<{id: string}>) => {
      const record = state.entryRevisions.find((record) => record.id === action.payload.id);
      if (!record) {
        return;
      }
      state.recordSelectedId = record.id;
    },
    unselectRecord: (state) => {
      state.recordSelectedId = null;
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
      const record = state.entryRevisions.find((record) => record.id === action.payload.id);
      if (!record) {
        return;
      }
      entryRevisions = entryRevisions.filter((recordItem) => recordItem.id !== action.payload.id);
      state.entryRevisions = state.entryRevisions.filter((entryRevision) => entryRevision.id !== action.payload.id);
      if (state.entryRevisions.length < 1) {
        // entries[state.dateSelected] = null; // for some reason an error occures here
        state.entries[state.dateSelected] = null;
      }
    },
  }
});

export const { setDate, selectRecord, unselectRecord, createRecord, editRecord, deleteRecord } = diarySlice.actions;
export default diarySlice.reducer;