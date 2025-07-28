import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // ✅ Make sure this file exists
import App from './Results'; // ✅ Corrected path

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
