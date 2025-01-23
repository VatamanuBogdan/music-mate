
import PlayerBar from "../components/player/PlayerBar";
import NavigationBar from "../components/NavigationBar";
import { Outlet } from "react-router";

export default function HomeLayout() {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <NavigationBar />
            
            <div className="flex-grow w-screen flex justify-center items-center"> 
                <Outlet />
            </div>

            <PlayerBar />
        </div>
    )
}