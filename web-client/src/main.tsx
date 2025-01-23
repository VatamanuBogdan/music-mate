import React, { PropsWithChildren } from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

import AuthenticationLayout from './layouts/AuthenticationLayout';

import './index.css'
import SignInForm from './pages/SignInForm';
import RegisterForm from './pages/RegisterForm';
import { AuthProvider } from './components/AuthProvider';
import HomeLayout from './layouts/HomeLayout';
import { HeroUIProvider } from '@heroui/react';
import ProtectedRoute from './components/ProtectedRoute';

function RootProviders({ children }: PropsWithChildren) {
    return (
        <HeroUIProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </HeroUIProvider>
    )
}

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RootProviders>
            <BrowserRouter>
                <Routes>
                    <Route path='auth' element={<AuthenticationLayout />} >
                        <Route index element={<SignInForm/>}/>
                        <Route path='login' element={<SignInForm/>}/>
                        <Route path='register' element={<RegisterForm/>}/>
                    </Route>

                    <Route path='home' element={ 
                        <ProtectedRoute fallbackRoute='/auth/login'>
                            <HomeLayout/>
                        </ProtectedRoute>
                    }>
            
                        <Route index element={<div> Index </div>} />
                        <Route path='spotify' element={<div> Spotify </div>} />
                        <Route path='youtube' element={<div> Youtube </div>} />
                        <Route path='mixed' element={<div> Mixed </div>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </RootProviders>
    </React.StrictMode>
)
