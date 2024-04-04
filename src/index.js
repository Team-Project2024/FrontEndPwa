import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { MobileProvider } from './context/UiProvider'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

serviceWorkerRegistration.register();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <MobileProvider>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
      </MobileProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);