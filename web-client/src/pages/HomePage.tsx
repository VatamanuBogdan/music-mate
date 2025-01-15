import { useAuth } from "../components/AuthProvider"

export default function HomePage() {
    const authUser = useAuth();
    
    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-6xl font-medium"> Welcome {authUser?.name} </h1>
        </div>
    )
}