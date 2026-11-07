import { useState } from 'react';
import './App.css';
import { useAppDispatch, useAppSelector } from './app/hooks';
import Button from './components/Button';
import CalendarView from './features/diary/CalendarView';
import EntryRevision from './features/diary/EntryRevision';
import AddEntryRevisionForm from './features/diary/AddEntryRevisionForm';
import { createEntryRevisionInitial, createEntryRevisionRetrospective, setDate } from './features/diary/diarySlice';
import { getLocalDateString } from './utils/utils';

function App() {
  const entryRevisions = useAppSelector((state) => state.diary.entryRevisions);
  const dateSelected = useAppSelector((state) => state.diary.dateSelected);
  const [isFormShown, setIsFormShown] = useState<boolean>(false);

  const dispath = useAppDispatch();

  const handleAddEntryRevisionInitial = (text: string) => {
    dispath(createEntryRevisionInitial(text));
    setIsFormShown(false);
  }
  const handleAddRetrospective = (text: string) => {
    dispath(createEntryRevisionRetrospective(text));
    setIsFormShown(false);
    console.log(entryRevisions);
  }
  const [handlePublish, setHandlePublish] = useState<(text: string) => void>(() => handleAddEntryRevisionInitial);
  
  const handleEntryRevisionInitial = () => {
    setHandlePublish(() => handleAddEntryRevisionInitial);
    setIsFormShown(true);
  }
  const handleRetrospective = () => {
    setHandlePublish(() => handleAddRetrospective);
    setIsFormShown(true);
  }

  return (
    <>
      <header className='header'>
        <div className='logo-wrapper'>
          <h1 className='logo-text'>Chronicle Flow</h1>
        </div>
        <div className='profile-wrapper'>
          <span className='profile-name'>Profile</span>
          <div className='profile-image-wrapper'></div>
        </div>
      </header>
      <div className='content-wrapper'>
        <aside className='asideLeft'>
          <div style={{textAlign: 'center'}}>Here will be the calendar later</div>
          <CalendarView />
          <div className='divider'></div>
        </aside>
        <main className='entry-view'>
          <div className='entryRevisions-wrapper'>
            {entryRevisions.map((entryRevision) => <EntryRevision entryRevision={entryRevision} />)}
          </div>
          {isFormShown && 
            <AddEntryRevisionForm 
              handleClose={() => {setIsFormShown(false)}}
              handlePublish={handlePublish}
            />
          }
          <div className='buttons-wrapper'>
            {getLocalDateString() === dateSelected && entryRevisions.length < 1 ? (
              <Button text='Add an entry' action={handleEntryRevisionInitial} />
            ) : (
              <Button text='Add retrospective' action={handleRetrospective} />
            )}
          </div>
        </main>
        <div className='add-entry-wrapper'>
          <Button 
            text='+' 
            action={() => {
              dispath(setDate(getLocalDateString()));
              if (entryRevisions.length > 0) {
                handleRetrospective();
              } else {
                handleEntryRevisionInitial();
              }
            }}
            width='100%'
            height='100%' />
        </div>
      </div>
    </>
  );
}

export default App;
