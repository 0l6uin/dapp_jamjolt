import React from 'react';
import ReactDOM from 'react-dom/client';
import PageRoutes from './PageRoutes';
import './defaults.css';
import 'normalize.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <PageRoutes />
  </React.StrictMode>
);