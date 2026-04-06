import { createRoot } from 'react-dom/client';
import Explorer from '../src/Explorer';
import { StrictMode } from 'react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Explorer />
  </StrictMode>
);
