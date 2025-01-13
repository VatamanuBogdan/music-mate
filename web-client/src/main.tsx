import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

import AuthenticationLayout from './pages/AuthenticationLayout';

import './index.css'
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AuthenticationLayout />} >
            <Route index element={<LoginForm/>}/>
            <Route path='login' element={<LoginForm/>}/>
            <Route path='register' element={<RegisterForm/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
)
