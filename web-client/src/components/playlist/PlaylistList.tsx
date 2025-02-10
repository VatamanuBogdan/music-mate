import { Spacer } from '@heroui/react';
import { PlaylistCard } from 'components/cards/PlaylistCard';
import { playlistMocks } from 'mocks/playlists';
import { useState } from 'react';
import { Playlist } from 'types/Playlist';

export default function PlaylistList(): JSX.Element {
    const [playlists] = useState<Playlist[]>(() => {
        return playlistMocks.concat(playlistMocks).concat(playlistMocks);
    });

    return (
        <ul className="max-h-[100vh] space-y-1 overflow-y-auto scrollbar">
            <Spacer key={'leading-offset'} y={20} />
            {playlists?.map((playlist) => (
                <li>
                    <PlaylistCard key={`playlist-${playlist.id}`} playlist={playlist} />
                </li>
            ))}
            <Spacer key={'trailing-offset'} y={40} />
        </ul>
    );
}
