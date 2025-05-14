import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import AppRoutes from './Routes';
import { SnackbarProvider } from 'notistack';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <SnackbarProvider>
        <AppRoutes />
      </SnackbarProvider>
    </Router>
  </React.StrictMode>
);
