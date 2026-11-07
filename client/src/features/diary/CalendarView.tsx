import { useState, type BaseSyntheticEvent } from "react";
import { getLocalDateString } from "../../utils/utils";
import { useAppDispatch } from "../../app/hooks";
import { setDate } from "./diarySlice";

function CalendarView() {
  const [dateSelected, setDateSelected] = useState<string>(getLocalDateString());
  
  const dispatch = useAppDispatch();

  const handleDateChange = (event: BaseSyntheticEvent) => {
    const newDate = event.target.value;
    setDateSelected(newDate);
    console.log(newDate);
    dispatch(setDate(newDate));
  }
  
  return (
    <input type='date' min='2025-01-01' max='2026-12-31' value={dateSelected} onChange={handleDateChange}></input>
  )
}

export default CalendarView;