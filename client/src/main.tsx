import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import { TOKEN_LOCAL_STORAGE_NAME } from './app/api/http.ts';
import { getMe } from './features/auth/AuthSlice.ts';

if (localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME)) {
  store.dispatch(getMe());
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
