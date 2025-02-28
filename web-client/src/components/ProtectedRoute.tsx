import { useAuth } from 'providers/AuthProvider';
import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';

type ProtectedRouteProps = PropsWithChildren & {
    fallbackRoute: string;
};

export default function ProtectedRoute({
    fallbackRoute,
    children,
}: ProtectedRouteProps): JSX.Element {
    const { isSignedIn } = useAuth();

    if (!isSignedIn) {
        return <Navigate to={fallbackRoute} replace />;
    }

    return <>{children}</>;
}
