import { PropsWithChildren } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../providers/AuthProvider";

type ProtectedRouteProps = PropsWithChildren & {
    fallbackRoute: string
};

export default function ProtectedRoute({ fallbackRoute, children }: ProtectedRouteProps) {

    const { isSignedIn } = useAuth();

    if (!isSignedIn) {
        return <Navigate to={fallbackRoute} replace />
    }
    
    return children;
}