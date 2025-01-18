import { PropsWithChildren } from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthProvider";

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {

    const { isSignedIn } = useAuth();

    if (!isSignedIn) {
        return <Navigate to="/auth/login" replace />
    }
    
    return children;
}