import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

import AuthenticationLayout from './pages/AuthenticationLayout';

import './index.css'
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import { AuthProvider } from './components/AuthProvider';
import HomePage from './pages/HomePage';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='auth' element={<AuthenticationLayout />} >
            <Route index element={<LoginForm/>}/>
            <Route path='login' element={<LoginForm/>}/>
            <Route path='register' element={<RegisterForm/>}/>
          </Route>
          <Route path='home' element={<HomePage/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
