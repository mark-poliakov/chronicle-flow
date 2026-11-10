import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface DropdownState {
  dropdownName: string,
}

const initialState: DropdownState = {
  dropdownName: '',
}

const dropdownSlice = createSlice({
  name: 'dropdown',
  initialState,
  reducers: {
    openDropdown: (state, action: PayloadAction<string>) => {
      state.dropdownName = action.payload;
    },
    closeDropdown: (state) => {
      state.dropdownName = '';
    },
  },
});

export const { openDropdown, closeDropdown } = dropdownSlice.actions;
export default dropdownSlice.reducer;