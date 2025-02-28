import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from 'providers/AuthProvider';
import React, { PropsWithChildren } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import ProtectedRoute from './components/ProtectedRoute';
import AuthenticationLayout from './layouts/AuthenticationLayout';
import HomeLayout from './layouts/HomeLayout';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import './index.css';

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

function HomeRoute(): JSX.Element {
    return (
        <ProtectedRoute fallbackRoute="/auth/sign-in">
            <HomeLayout />
        </ProtectedRoute>
    );
}

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RootProviders>
            <BrowserRouter>
                <Routes>
                    <Route path="auth" element={<AuthenticationLayout />}>
                        <Route index element={<SignInPage />} />
                        <Route path="sign-in" element={<SignInPage />} />
                        <Route path="sign-up" element={<SignUpPage />} />
                    </Route>

                    <Route index element={<HomeRoute />} />
                    <Route path="home" element={<HomeRoute />} />
                </Routes>
            </BrowserRouter>
        </RootProviders>
    </React.StrictMode>
);
