import { useAuth } from "../components/AuthProvider"

export default function HomePage() {
    const { isSignedIn } = useAuth();

    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-6xl font-medium"> Welcome! You are {isSignedIn ? '' : 'not'} signed in! </h1>
        </div>
    )
}