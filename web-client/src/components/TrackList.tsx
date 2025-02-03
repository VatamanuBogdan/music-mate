import { Button, Image } from "@heroui/react";
import { IoPlayCircleSharp } from "react-icons/io5";
import { TrackMock, trackMocks } from "../mocks/tracks";
import { useState } from "react";

function TracksItemCard({ track, index }: TrackMock & { index: number }) {
    return (
        <ul key={track.id}>
            <Button 
                className='bg-slate-800 h-16' 
                radius='md' 
                fullWidth
                >

                <div className="flex flex-row justify-start items-center w-full space-x-1">
                    <Image 
                        width={54}
                        height={54}
                        src={track.imageUrl} 
                        />

                    <h1 className="text-lg text-slate-200 font-medium">{track.name}</h1>
                    <span className="text-slate-200">-</span>
                    <h2 className="text-lg text-slate-300">{track.artist}</h2>
                </div>
            </Button>
        </ul>
    )
}

export default function TrackList() {
    const [tracks] = useState(() => {
        let result = trackMocks;
        for (let i = 0; i < 10; i++) {
            result = result.concat(trackMocks);
        }
        return result;
    });
    
    const listItems = tracks.map((track) => {
        return <li key={track.id}> {TracksItemCard({track})} </li>
    })
    
    return (
        <ul className="max-h-[90vh] w-full py-4 px-6 space-y-1 bg-slate-900 overflow-y-auto">
            {listItems}
        </ul>
    )
}