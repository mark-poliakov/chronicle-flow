import { useState, type BaseSyntheticEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getRecords, setDate } from "./diarySlice";

function CalendarView() {
  const dateSelectedState = useAppSelector((state) => state.diary.dateSelected);
  const [dateSelected, setDateSelected] = useState<string>(dateSelectedState);
  
  const dispatch = useAppDispatch();

  const handleDateChange = (event: BaseSyntheticEvent) => {
    const newDate = event.target.value;
    setDateSelected(newDate);
    dispatch(setDate({ dateString: newDate }));
    dispatch(getRecords(newDate));
  }
  
  return (
    <input type='date' min='2025-01-01' max='2026-12-31' value={dateSelected} onChange={handleDateChange}></input>
  )
}

export default CalendarView;