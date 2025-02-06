import { Spacer } from '@heroui/react';
import { useState } from 'react';

import { playlistMocks } from '../mocks/playlists';
import { PlaylistCard } from './cards/PlaylistCard';
import PlaylistHeader from './PlaylistsHeader';
import { Playlist } from '../types/Playlist';

export default function PlaylistPanel(): JSX.Element {
    const [playlists] = useState<Playlist[]>(() => {
        return playlistMocks.concat(playlistMocks).concat(playlistMocks);
    });

    return (
        <div className="relative w-[30rem] bg-slate-800 bg-opacity-75 overflow-visible">
            <div className="absolute top-0 left-0 right-0 z-10">
                <PlaylistHeader
                    height="h-20"
                    defaultSource="spotify"
                    onSourceChange={(s) => {
                        console.log(`Playlist source changed to ${s}`);
                    }}
                />
            </div>
            <ul className="max-h-[100vh] space-y-1 overflow-y-auto scrollbar">
                <Spacer key={'leading-offset'} y={20} />
                {playlists?.map((playlist) => (
                    <li>
                        <PlaylistCard key={`playlist-${playlist.id}`} playlist={playlist} />
                    </li>
                ))}
                <Spacer key={'trailing-offset'} y={40} />
            </ul>
        </div>
    );
}
