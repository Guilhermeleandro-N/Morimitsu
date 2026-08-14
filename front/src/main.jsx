import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ToastProvider from './components/Toast/ToastProvider.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App/>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  
)
