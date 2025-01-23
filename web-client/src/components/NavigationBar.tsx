import { IconType } from "react-icons";
import AccountAvatar from "./AccountAvatar";
import MusicMateLogo from "./MusicMateLogo";
import { Button } from "@heroui/button";
import { FaMix, FaSpotify, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router";

const navigationButtonIconSize = 32;

interface NavigationButtonProps {
    iconType: IconType,
    text: string,
    onPress: () => void
}

function NavigationButton({ iconType, text, onPress }: NavigationButtonProps) {
    return (
        <Button
            className="h-16 w-54 font-bold" 
            radius="none"
            startContent={iconType({ size: navigationButtonIconSize })}
            onPress={onPress}
            >

            <span className="text-2xl">
                {text}
            </span>
        </Button>
    )
}

export default function NavigationBar() {
    const navigate = useNavigate();
    
    return (
        <div className="flex w-screen justify-between items-center px-2 bg-zinc-100">
            <MusicMateLogo size="sm" />
            
            <div>
                <NavigationButton iconType={FaSpotify} text="Spotify" onPress={() => navigate('/home/spotify')} />
                <NavigationButton iconType={FaYoutube} text="Youtube" onPress={() => navigate('/home/youtube')}  />
                <NavigationButton iconType={FaMix} text="Mixed" onPress={() => navigate('/home/mixed')}  />
            </div>

            <AccountAvatar />
        </div>
    )
}