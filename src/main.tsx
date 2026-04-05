import { createRoot } from 'react-dom/client';
// import App from './App';
import { StrictMode } from 'react';
import Builder from './Builder';

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <Builder />
  </StrictMode>
);
