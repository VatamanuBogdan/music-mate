import { Image } from '@heroui/react';

import { Playlist } from '../../types/Playlist';
import { formatPlaylistDuration } from '../../utils/helpers';

interface PlaylistCardProps {
    playlist: Playlist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps): JSX.Element {
    return (
        <div className="h-24 mx-2 flex justify-start items-center text-slate-100 bg-slate-800 backdrop-blur-md bg-opacity-85 rounded-lg cursor-pointer select-none">
            <Image className="w-20 h-20 ml-2 z-0" radius="md" src={playlist.thumbnailUrl} />

            <div className="flex-grow mx-3 -space-y-1">
                <div className="flex-grow flex felx-row justify-between items-baseline">
                    <div className="text-lg font-bold max-w-64 overflow-hidden text-ellipsis whitespace-nowrap">
                        {playlist.name}
                    </div>
                    <div className="text-sm max-w-64 overflow-hidden text-ellipsis whitespace-nowrap">
                        {formatPlaylistDuration(playlist.duration)}
                    </div>
                </div>

                <div className="flex-grow whitespace-nowrap flex felx-row justify-between items-baseline">
                    <div className="text-base">{playlist.description}</div>
                    <div className="text-sm">{playlist.tracksCount} songs</div>
                </div>
            </div>
        </div>
    );
}
