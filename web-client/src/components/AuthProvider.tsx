import { createContext, PropsWithChildren, useContext, useState } from "react";
import { User } from "../types/User";

const AuthContext = createContext<User | null>(null);

export const useAuth = () => {
    const context = useContext<User | null>(AuthContext);

    if (context === undefined) {
        throw Error('useAuth must be used within an AuthProvider')
    }

    return context;
}

type AuthProviderProps = PropsWithChildren;

export function AuthProvider({ children }: AuthProviderProps) {
    
    const [authUser] = useState<User>({ 
        email: 'mock@gmail.com',
        name: "Mocked User"
    });
    
    return (
        <AuthContext.Provider value={authUser}>
            {children}
        </AuthContext.Provider>
    )
}
