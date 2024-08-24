


import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthProvider';


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

serviceWorkerRegistration.register();

ReactDOM.render(
  
   
    <BrowserRouter>
  


 
      <AuthProvider>
     
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
        
      </AuthProvider>

     
     
    </BrowserRouter>,
    
   
 
  document.getElementById('root')
);