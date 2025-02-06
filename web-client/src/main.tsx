import { HeroUIProvider } from '@heroui/react';
import React, { PropsWithChildren } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import { AuthProvider } from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticationLayout from './layouts/AuthenticationLayout';
import HomeLayout from './layouts/HomeLayout';
import RegisterForm from './pages/RegisterForm';
import './index.css';
import SignInForm from './pages/SignInForm';

function RootProviders({ children }: PropsWithChildren) {
    return (
        <HeroUIProvider>
            <AuthProvider>{children}</AuthProvider>
        </HeroUIProvider>
    );
}

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RootProviders>
            <BrowserRouter>
                <Routes>
                    <Route path="auth" element={<AuthenticationLayout />}>
                        <Route index element={<SignInForm />} />
                        <Route path="login" element={<SignInForm />} />
                        <Route path="register" element={<RegisterForm />} />
                    </Route>

                    <Route
                        path="home"
                        element={
                            <ProtectedRoute fallbackRoute="/auth/login">
                                <HomeLayout />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </RootProviders>
    </React.StrictMode>
);
