import { useEffect, useState, type MouseEvent } from 'react';
import './App.css';
import { useAppDispatch, useAppSelector } from './app/hooks';
import Button from './components/Button';
import CalendarView from './features/diary/CalendarView';
import EntryRevision from './features/diary/EntryRevision';
import AddEntryRevisionForm from './features/diary/AddEntryRevisionForm';
import { beginEditingRecord, createRecord, deleteRecord, setDate, unselectRecord } from './features/diary/diarySlice';
import { getLocalDateString } from './utils/utils';
import RevisionHistory from './features/diary/RevisionHistory';
import AuthScreen from './features/auth/AuthScreen';

function App() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  const entryRevisions = useAppSelector((state) => state.diary.entryRevisions);
  const dateSelected = useAppSelector((state) => state.diary.dateSelected);
  const recordSelectedId = useAppSelector((state) => state.diary.recordSelectedId);

  const userEmail = useAppSelector((state) => state.auth.email);
  
  const [isFormShown, setIsFormShown] = useState<boolean>(false);

  const dispath = useAppDispatch();

  const handleCreateRecord = (text: string) => {
    dispath(createRecord({ targetDate: dateSelected, content: text }));
    setIsFormShown(false);
  }

  const handleWindowClick = () => {dispath(unselectRecord())};
  useEffect(() => {
    window.onclick = handleWindowClick;
    return () => {
      window.onclick = null;
    }
  }, [])

  const handleEditRecord = (event: MouseEvent) => {
    event.stopPropagation();
    // window.onclick = null;
    dispath(beginEditingRecord());
  }
  
  const handleDeleteRecord = () => {
    dispath(deleteRecord(recordSelectedId!));
    dispath(unselectRecord());
  }

  return isLoggedIn ? (
    <>
      <header className='header'>
        <div className='logo-wrapper'>
          <h1 className='logo-text'>Chronicle Flow</h1>
        </div>
        <div className='profile-wrapper'>
          <span className='profile-name'>{userEmail ?? 'Profile'}</span>
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
            {entryRevisions.map((entryRevision) => <EntryRevision entryRevision={entryRevision} key={entryRevision.id} />)}
          </div>
          {isFormShown && 
            <AddEntryRevisionForm 
              handleClose={() => {setIsFormShown(false)}}
              handlePublish={handleCreateRecord}
            />
          }
          <div className='buttons-wrapper'>
            <div className='button-wrapper'>
              <Button text='Add text' action={() => {setIsFormShown(true)}} disabled={dateSelected === ''} />
            </div>
            <div className='button-wrapper'>
              <Button text='Edit record' action={handleEditRecord} disabled={recordSelectedId === null} />
            </div>
            <div className='button-wrapper'>
              <Button text='Delete record' action={handleDeleteRecord} disabled={recordSelectedId === null} />
            </div>
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
  ) : (
    <AuthScreen />
  );
}

export default App;
