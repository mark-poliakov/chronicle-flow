import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Entry, EntryRevision } from "../../types/types";
import { getLocalDateString } from "../../utils/utils";

// temporary static data
const entries: Record<string, Entry> = {
  '2026-11-06': { id: '1', targetDate: getLocalDateString(new Date(2026, 10, 6)), createdAt: Date.UTC(2026, 10, 6) },
  '2026-11-05': { id: '2', targetDate: getLocalDateString(new Date(2026, 10, 5)), createdAt: Date.UTC(2026, 10, 5) },
  '2026-11-07': { id: '3', targetDate: getLocalDateString(new Date(2026, 10, 7)), createdAt: Date.UTC(2026, 10, 7) },
}
const entryRevisions: EntryRevision[] = [
  { id: '1', entryId: '3', content: 'This is an entry revision', revisionType: 'INITIAL', createdAt: Date.UTC(2026, 10, 7) },
  { id: '2', entryId: '3', content: 'This is another entry revision', revisionType: 'RETROSPECTIVE_EDIT', createdAt: Date.UTC(2026, 10, 7) },
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
  entryRevisions: entryRevisions.filter((entryRevision) => entryRevision.entryId === entries[dateSelectedInitial].id),
};

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    setDate: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        return;
      }
      state.dateSelected = action.payload;
      
      const existingEntry = state.entries[state.dateSelected];
      if (existingEntry) {
        state.entryRevisions = entryRevisions.filter((entryRevision) => entryRevision.entryId === existingEntry.id);
      } else {
        state.entryRevisions = [];
      }
    },
    createEntryRevisionRetrospective: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        return;
      }
      const existingEntry = state.entries[state.dateSelected];
      let entryId;
      if (!existingEntry) {
        entryId = 'new';
        state.entries[getLocalDateString()] = ({
          id: entryId,
          targetDate: state.dateSelected,
          createdAt: Date.now(),
        }) 
      } else {
        entryId = existingEntry.id;
      }

      const newEntryRevision: EntryRevision = {
        id: '1',
        entryId,
        content: action.payload,
        revisionType: 'RETROSPECTIVE_EDIT',
        createdAt: Date.now(),
      }
      entryRevisions.push(newEntryRevision);
      state.entryRevisions.push(newEntryRevision);
    },
    createEntryRevisionInitial: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        return;
      }
      let entryId = 'init';
      if (!state.entries[getLocalDateString()]) {
        state.entries[getLocalDateString()] = ({
          id: entryId,
          targetDate: state.dateSelected,
          createdAt: Date.now(),
        })
      } else {
        entryId = state.entries[getLocalDateString()].id;
      }
      const newEntryRevision: EntryRevision = {
        id: '100',
        entryId,
        content: action.payload,
        revisionType: 'INITIAL',
        createdAt: Date.now(),
      }
      entryRevisions.push(newEntryRevision);
      state.entryRevisions.push(newEntryRevision);
    }
  }
});

export const { setDate, createEntryRevisionRetrospective, createEntryRevisionInitial } = diarySlice.actions;
export default diarySlice.reducer;