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
import Profile from './features/auth/Profile';
import type { ModalParameters } from './types/types';
import { closeModal, showModal } from './components/modalSlice';
import Modal from './components/Modal';
import { handleWindowClick } from './features/diary/utils/utils';

function App() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  const entryRevisions = useAppSelector((state) => state.diary.entryRevisions);
  const dateSelected = useAppSelector((state) => state.diary.dateSelected);
  const recordSelectedId = useAppSelector((state) => state.diary.recordSelectedId);
  
  const [isFormShown, setIsFormShown] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleCreateRecord = (text: string) => {
    dispatch(createRecord({ targetDate: dateSelected, content: text }));
    setIsFormShown(false);
  };

  useEffect(() => {
    window.addEventListener('click', handleWindowClick);
  }, [])

  const editingConfirmationModal: ModalParameters = {
    name: 'edit-confirmation',
    heading: 'Warning',
    message: 'Do you really want to edit the record? You could add new block of text',
    options: [
      { text: 'Yes', action: (event) => {
        event.stopPropagation();
        dispatch(beginEditingRecord());
        dispatch(closeModal());
      } },
      { text: 'No', action: (event) => {
        event.stopPropagation();
        dispatch(closeModal());
      } },
    ],
  };
  const handleEditRecord = (event: MouseEvent) => {
    event.stopPropagation();
    // window.onclick = null;
    dispatch(showModal(editingConfirmationModal.name));
  };
  const deletingConfirmationModal: ModalParameters = {
    name: 'delete-confirmation',
    heading: 'Warning',
    message: 'Do you really want to delete the record? It will be lost permanently',
    options: [
      { text: 'Yes', action: (event) => {
        event.stopPropagation();
        dispatch(deleteRecord(recordSelectedId!));
        dispatch(unselectRecord());
        dispatch(closeModal());
      } },
      { text: 'No', action: (event) => {
        event.stopPropagation();
        dispatch(closeModal());
      } },
    ],
  };
  const handleDeleteRecord = (event: MouseEvent) => {
    event.stopPropagation();
    dispatch(showModal(deletingConfirmationModal.name));
  };

  return isLoggedIn ? (
    <>
      <header className='header'>
        <div className='logo-wrapper'>
          <h1 className='logo-text'>Chronicle Flow</h1>
        </div>
        <Profile />
      </header>
      <div className='content-wrapper'>
        <aside className='asideLeft'>
          <div style={{textAlign: 'center'}}></div>
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
              <Button buttonParameters={{text: 'Add text', action: () => {setIsFormShown(true)}, disabled: dateSelected === ''}} />
            </div>
            <div className='button-wrapper'>
              <Button buttonParameters={{text:'Edit record', action: handleEditRecord, disabled: recordSelectedId === null}} />
            </div>
            <div className='button-wrapper'>
              <Button buttonParameters={{text: 'Delete record', action: handleDeleteRecord, disabled: recordSelectedId === null}} />
            </div>
          </div>
        </main>
        <div className='add-entry-wrapper' title='Write about today'>
          <Button 
            buttonParameters={{
              text: '+', 
              action: () => {
                dispatch(setDate({ dateString: getLocalDateString() }));
                setIsFormShown(true);
              },
              width: '100%',
              height: '100%',
              disabled: dateSelected === '',
            }}
          />
        </div>
      </div>
      <Modal modalParameters={editingConfirmationModal} />
      <Modal modalParameters={deletingConfirmationModal} />
    </>
  ) : (
    <AuthScreen />
  );
}

export default App;
