import { useState } from 'react';

import { trackMocks } from '../mocks/tracks';
import { Track } from '../types/Track';
import TrackCard from './cards/TrackCard';

export default function TrackList(): JSX.Element {
    const [tracks] = useState(() => {
        return new Array<Track | undefined>(30).fill(undefined).map((_v, i) => {
            return trackMocks[i % trackMocks.length];
        }) as Array<Track>;
    });

    const tracksCard = tracks.map((track, index) => {
        return (
            <li key={track.id}>
                <TrackCard index={index + 1} track={track} />
            </li>
        );
    });

    return (
        // TODO: Expose bar height as global tailwind variable
        <ul className="max-h-[calc(100vh-5rem)] w-full py-4 px-2 space-y-1 bg-slate-700 bg-opacity-75 scrollbar overflow-y-auto">
            {tracksCard}
        </ul>
    );
}
