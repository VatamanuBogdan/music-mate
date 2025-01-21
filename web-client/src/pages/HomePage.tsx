
import PlayerBar from "../components/player/PlayerBar";
import AccountAvatar from "../components/AccountAvatar";

import { useAccount, useAuth } from "../components/AuthProvider"

export default function HomePage() {
    const { isSignedIn } = useAuth();
    const { username } = useAccount();

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex w-screen justify-end">
                <AccountAvatar />
            </div>
            
            <div className="flex-grow flex flex-col justify-center items-center">
                <h1 className="text-6xl font-medium"> Welcome {username}! </h1>
                <h2 className="text-5xl"> You are {isSignedIn ? '' : 'not'} signed in. </h2>
            </div>
            
            <PlayerBar />
        </div>
    )
}