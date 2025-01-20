import { useState } from "react";
import PlayerControls from "./PlayerControls";

export default function PlayerBar() {
    
    // TODO: Probably state will be replaced by a context
    const [progress, setProgress] = useState(0);
    const [duration] = useState(196);
    const [volume, setVolume] = useState(50);

    function onBackwardTap() {
        console.log(`[Player]: Backward taped}`);
    }

    function onForwardTap() {
        console.log(`[Player]: Forward taped}`);
    }

    function onPlayTap() {
        console.log(`[Player]: Play taped}`);
    }

    function onTimelineChange(progress: number | number[]) {
        console.log(`[Player]: Timeline changed ${progress}`);
        if (progress instanceof Array) {
            setProgress(progress[progress.length - 1]);
        } else {
            setProgress(progress);
        }
    }

    function onVolumeChange(volume: number | number[]) {
        console.log(`[Player]: Volume changed ${volume}`);
        if (volume instanceof Array) {
            setVolume(volume[volume.length - 1]);
        } else {
            setVolume(volume);
        }
    }
    
    return (
        <div className="flex w-screen justify-center items-center h-24 space-x-10 bg-zinc-100 border-2">

        <div>
            <p className="text-lg"> Song name </p>
            <p className="text-base text-center"> Artist </p>
        </div>
    
        <PlayerControls
            onPlayTap={onPlayTap} 
            onBackwardTap={onBackwardTap} 
            onForwardTap={onForwardTap} 
            timelineProps={{
                progressInSeconds: progress,
                durationInSeconds: duration,
                onChange: onTimelineChange
            }}
            volumeProps={{
                volume: volume,
                maxVolume: 100,
                onChange: onVolumeChange
            }}/>
    </div>
    )
} 