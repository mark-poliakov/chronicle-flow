import './App.css';
import { useAppSelector } from './app/hooks';
import Button from './components/Button';
import CalendarView from './features/diary/CalendarView';
import EntryRevision from './features/diary/EntryRevision';

function App() {
  const entryRevisions = useAppSelector((state) => state.diary.entryRevisions);

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
          <div className='buttons-wrapper'>
            <Button text='Add retrospective' action={() => {}}/>
          </div>
        </main>
        <div className='add-entry-wrapper'>
          <Button text='+' action={() => {}} width='100%' height='100%'/>
        </div>
      </div>
    </>
  );
}

export default App;
