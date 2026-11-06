import './App.css';

function App() {

  return (
    <>
      <header className='header'>
        <div className='logo-wrapper'>
          <h1 className='logo-text'>Diary</h1>
        </div>
        <div className='profile-wrapper'>
          <span className='profile-name'>Profile</span>
          <div className='profile-image-wrapper'></div>
        </div>
      </header>
      <div className='content-wrapper'>
        <aside className='asideLeft'>
          <div style={{textAlign: 'center'}}>Here will be the calendar later</div>
          <div className='divider'></div>
        </aside>
        <main className='entry-view'>
          <div style={{ flex: 1 }}>
            Hello World!
          </div>
          <div className='buttons-wrapper'>
            <button>Edit entry</button>
            <button>Add retroperspective</button>
          </div>
        </main>
        <button className='add-entry-button'>+</button>
      </div>
    </>
  );
}

export default App;
