
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { UserProvider } from './context/UserContext'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
// main.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import { GoogleOAuthProvider } from '@react-oauth/google';



const clientId = '421990197067-1f96r700dlj2fl1q24m4hgedhhtornmb.apps.googleusercontent.com';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);