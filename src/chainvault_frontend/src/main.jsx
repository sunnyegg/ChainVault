import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';  // Import styles first
import App from './App';
import { ToastProvider } from "@tixia/design-system";
import { Providers } from './lib/providers';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Providers>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Providers>
  </React.StrictMode>,
);
