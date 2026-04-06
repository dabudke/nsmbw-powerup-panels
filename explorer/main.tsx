import { createRoot } from 'react-dom/client';
import Viewer from '../src/Explorer';
import { StrictMode } from 'react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Viewer />
  </StrictMode>
);
