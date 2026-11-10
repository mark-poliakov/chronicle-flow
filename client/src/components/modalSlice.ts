import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  modalName: string,
}

const initialState: ModalState = {
  modalName: '',
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state, action: PayloadAction<string>) => {
      if (action.payload) {
        state.modalName = action.payload;
      }
    },
    closeModal: (state) => {
      state.modalName = '';
    },
  },
});

export const { showModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;