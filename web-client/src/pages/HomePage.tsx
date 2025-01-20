import { Button } from "@heroui/react";
import { useAuth } from "../components/AuthProvider"
import PlayerControls from "../components/player/PlayerControls";

import {Popover, PopoverTrigger, PopoverContent} from "@heroui/popover";
import PlayerBar from "../components/player/PlayerBar";

export default function HomePage() {
    const { isSignedIn } = useAuth();

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex-grow flex justify-center items-center">
                <h1 className="text-6xl font-medium"> Welcome! You are {isSignedIn ? '' : 'not'} signed in! </h1>
            </div>
            
            <PlayerBar />

        </div>
    )
}