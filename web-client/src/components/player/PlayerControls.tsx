import { IoPlayCircleSharp } from "react-icons/io5";
import { IoMdSkipForward, IoMdSkipBackward } from "react-icons/io";
import { Button } from "@heroui/react";
import { PropsWithChildren } from "react";
import VolumeButton, { VolumeButtonProps } from "./VolumeButton";
import MusicTimeline, { MediaTimelineProps } from "./MediaTimeline";

const skipButtonSize = 24;
const playButtonSize = 40;

export interface PlayerControlsProps extends PropsWithChildren {
    onBackwardTap?: () => void
    onForwardTap?: () => void
    onPlayTap?: () => void
    timelineProps: MediaTimelineProps
    volumeProps: VolumeButtonProps 
}

export default function PlayerControls({ 
    onBackwardTap, 
    onPlayTap, 
    onForwardTap, 
    timelineProps: timeline, 
    volumeProps: volume 
}: PlayerControlsProps
) {
    const playButtonsClassName = "bg-transparent";

    return (
        <div className='flex justify-center items-center space-x-4'>
            <div className='flex justify-center items-center space-x-2'>
                <Button 
                    className={playButtonsClassName}
                    radius='full' 
                    isIconOnly
                    onPress={onBackwardTap}
                    >
                    <IoMdSkipBackward size={skipButtonSize}/>
                </Button>

                <Button 
                    className={playButtonsClassName} 
                    radius='full' 
                    isIconOnly 
                    onPress={onPlayTap}
                    >
                    
                    <IoPlayCircleSharp size={playButtonSize} />
                </Button>

                <Button 
                    className={playButtonsClassName}
                    radius='full' 
                    isIconOnly
                    onPress={onForwardTap}
                    >
                    <IoMdSkipForward size={skipButtonSize}/>
                </Button>
            </div>
            
            <MusicTimeline {...timeline} />

            <VolumeButton {...volume} />
        </div>
    )
}
