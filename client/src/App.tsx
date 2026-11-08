import { useState } from 'react';
import './App.css';
import { useAppDispatch, useAppSelector } from './app/hooks';
import Button from './components/Button';
import CalendarView from './features/diary/CalendarView';
import EntryRevision from './features/diary/EntryRevision';
import AddEntryRevisionForm from './features/diary/AddEntryRevisionForm';
import { createRecord, setDate } from './features/diary/diarySlice';
import { getLocalDateString } from './utils/utils';
import RevisionHistory from './features/diary/RevisionHistory';

function App() {
  const entryRevisions = useAppSelector((state) => state.diary.entryRevisions);
  const dateSelected = useAppSelector((state) => state.diary.dateSelected);
  const [isFormShown, setIsFormShown] = useState<boolean>(false);

  const dispath = useAppDispatch();

  const handleCreateRecord = (text: string) => {
    dispath(createRecord({ content: text }));
    setIsFormShown(false);
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
          <RevisionHistory />
        </aside>
        <main className='entry-view'>
          <div className='entryRevisions-wrapper'>
            {entryRevisions.map((entryRevision) => <EntryRevision entryRevision={entryRevision} />)}
          </div>
          {isFormShown && 
            <AddEntryRevisionForm 
              handleClose={() => {setIsFormShown(false)}}
              handlePublish={handleCreateRecord}
            />
          }
          <div className='buttons-wrapper'>
              <Button text='Add text' action={() => {setIsFormShown(true)}} disabled={dateSelected === ''} />
          </div>
        </main>
        <div className='add-entry-wrapper' title='Write about today'>
          <Button 
            text='+' 
            action={() => {
              dispath(setDate({ dateString: getLocalDateString() }));
              setIsFormShown(true);
            }}
            width='100%'
            height='100%'
            disabled={dateSelected === ''}
          />
        </div>
      </div>
    </>
  );
}

export default App;
