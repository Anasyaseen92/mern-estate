import React from 'react';
import { createRoot } from 'react-dom/client'; // ✅ this is required
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
