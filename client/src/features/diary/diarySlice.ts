import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import type { Entry, EntryRevision } from "../../types/types";
import { getLocalDateString } from "../../utils/utils";
import { http } from "../../app/api/http";

interface DiaryState {
  dateSelected: string,
  entries: Record<string, Entry | null>,
  entryRevisions: EntryRevision[],
  recordSelectedId: string | null,
  isRecordBeingEdited: boolean,
  status: 'idle' | 'loading' | 'suceeded' | 'failed',
  error: string | null,
}

export const getEntries = createAsyncThunk('diary/getEntries', () => {
  return http<Entry[]>('/diary/entries');
});

export const getRecords = createAsyncThunk('diary/getRecords', (targetDate: string) => {
  return http<EntryRevision[]>(`/diary/records/${targetDate}`);
});

export const createRecord = createAsyncThunk('diary/createRecord', (data: { targetDate: string, content: string }) => {
  return http<EntryRevision>('/diary', {
    method: 'POST',
    body: JSON.stringify(data),
  });
});

export const editRecord = createAsyncThunk('diary/editRecord', ({ recordId, data }: { recordId: string, data: { content: string } }) => {
  return http<EntryRevision>(`/diary/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
});

export const deleteRecord = createAsyncThunk('diary/deleteRecord', (recordId: string) => {
  return http<void>(`/diary/${recordId}`, {
    method: 'DELETE',
  });
});

const initialState: DiaryState = {
  dateSelected: getLocalDateString(),
  entries: {},
  entryRevisions: [],
  recordSelectedId: null,
  isRecordBeingEdited: false,
  status: 'idle',
  error: null,
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
      state.recordSelectedId = null;

      const existingEntry = state.entries[action.payload.dateString];
      if (existingEntry) {
        state.entryRevisions = [];
      }
    },
    selectRecord: (state, action: PayloadAction<{id: string}>) => {
      const record = state.entryRevisions.find((record) => record.id === action.payload.id);
      if (!record) {
        return;
      }
      state.recordSelectedId = record.id;

      state.isRecordBeingEdited = false;
    },
    unselectRecord: (state) => {
      state.recordSelectedId = null;

      state.isRecordBeingEdited = false;
    },
    beginEditingRecord: (state) => {
      state.isRecordBeingEdited = true;
    },
    endEditingRecord: (state) => {
      state.isRecordBeingEdited = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEntries.fulfilled, (state, action) => {
        for(let i = 0; i < action.payload.length; i++) {
          state.entries[action.payload[i].targetDate] = { 
            id: action.payload[i].id,
            targetDate: action.payload[i].targetDate,
            createdAt: action.payload[i].createdAt,
            updatedAt: action.payload[i].updatedAt,
          };
        }
      })
      .addCase(getRecords.fulfilled, (state, action) => {
        state.entryRevisions = action.payload;
      })
      .addCase(createRecord.fulfilled, (state, action) => {
        state.entryRevisions = [...state.entryRevisions, action.payload];
        state.entries[action.meta.arg.targetDate] = { 
          id: action.payload.entryId,
          targetDate: action.meta.arg.targetDate,
          createdAt: action.payload.createdAt,
          updatedAt: action.payload.updatedAt,
        };
      })
      .addCase(editRecord.fulfilled, (state, action) => {
        const recordIndex = state.entryRevisions.findIndex((record) => record.id === action.payload.id);
        if (recordIndex !== -1) {
          state.entryRevisions[recordIndex] = action.payload;
          console.warn(`Record ${action.payload.id} did not exist`);
        }
      })
      .addCase(deleteRecord.fulfilled, (state, action) => {
        state.entryRevisions = state.entryRevisions.filter((record) => record.id !== action.meta.arg);
      })
      .addMatcher(
        isAnyOf(
          getEntries.fulfilled, getRecords.fulfilled, createRecord.fulfilled, editRecord.fulfilled, deleteRecord.fulfilled,
        ),
        (state) => { state.status = 'suceeded' }
      )

      .addMatcher(
        isAnyOf(
          getEntries.pending, getRecords.pending, createRecord.pending, editRecord.pending, deleteRecord.pending,
        ),
        (state) => { state.status = 'loading'; state.error = null }
      )

      .addMatcher(
        isAnyOf(
          getEntries.rejected, getRecords.rejected, createRecord.rejected, editRecord.rejected, deleteRecord.rejected,
        ),
        (state, action) => { state.status = 'failed'; state.error = action.error.message ?? 'Request failed' }
      )
  }
});

export const { setDate, selectRecord, unselectRecord, beginEditingRecord, endEditingRecord } = diarySlice.actions;
export default diarySlice.reducer;