import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { TOKEN_LOCAL_STORAGE_NAME } from './app/api/http';
import { getMe } from './features/auth/authSlice';
import { closeDropdown } from './components/dropdownSlice';

if (localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME)) {
  store.dispatch(getMe());
}
window.addEventListener('click', () => {store.dispatch(closeDropdown())});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
