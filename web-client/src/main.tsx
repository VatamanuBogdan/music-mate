import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { PropsWithChildren } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import { AuthProvider } from './providers/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticationLayout from './layouts/AuthenticationLayout';
import HomeLayout from './layouts/HomeLayout';
import RegisterForm from './pages/RegisterForm';
import './index.css';
import SignInForm from './pages/SignInForm';

const queryClient = new QueryClient();

function RootProviders({ children }: PropsWithChildren) {
    return (
        <HeroUIProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>{children}</AuthProvider>
            </QueryClientProvider>
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
