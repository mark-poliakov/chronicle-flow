import { store } from "../../../app/store";
import { unselectRecord } from "../diarySlice";

export const handleWindowClick = () => {
  store.dispatch(unselectRecord());
};