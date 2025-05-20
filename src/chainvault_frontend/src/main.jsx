import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';  // Import styles first
import App from './App';
import { ToastProvider } from "@tixia/design-system";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
);
