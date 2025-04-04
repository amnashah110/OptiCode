import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import AppRoutes from './Routes';
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <React.StrictMode>
    <Router>
        <SnackbarProvider>
          <AppRoutes />
        </SnackbarProvider>
    </Router>
  </React.StrictMode >,
  document.getElementById('root')
);