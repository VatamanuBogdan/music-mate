import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

import AuthenticationLayout from './pages/AuthenticationLayout';

import './index.css'
import SignInForm from './pages/SignInForm';
import RegisterForm from './pages/RegisterForm';
import { AuthProvider } from './components/AuthProvider';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='auth' element={<AuthenticationLayout />} >
              <Route index element={<SignInForm/>}/>
              <Route path='login' element={<SignInForm/>}/>
              <Route path='register' element={<RegisterForm/>}/>
            </Route>
            <Route path='home' element={<ProtectedRoute> <HomePage/> </ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>
)
