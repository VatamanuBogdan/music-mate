import { useDisclosure } from '@heroui/react';
import AddPlaylistModal from 'components/playlist/PlaylistAddModal';
import PlaylistHeader, { PlaylistSource } from 'components/playlist/PlaylistsHeader';
import { useState } from 'react';

import PlaylistList from '../lists/PlaylistList';

export default function PlaylistPanel(): JSX.Element {
    const playlistAddModalDisc = useDisclosure();
    const [playlistSource, setPlaylistSource] = useState<PlaylistSource>('mixed');

    return (
        <div className="relative w-[30rem] bg-slate-800 bg-opacity-75 overflow-visible">
            <div className="">
                <PlaylistHeader
                    height="h-20"
                    selectedSource={playlistSource}
                    onAddPress={playlistAddModalDisc.onOpenChange}
                    onSourceChange={setPlaylistSource}
                />
            </div>

            <AddPlaylistModal
                isOpen={playlistAddModalDisc.isOpen}
                onOpenChange={playlistAddModalDisc.onOpenChange}
            />

            {playlistSource === 'mixed' ? (
                <PlaylistList />
            ) : (
                <div className="w-full h-full flex flex-row items-center justify-center text-2xl font-bold text-slate-300">
                    Not implemented
                </div>
            )}
        </div>
    );
}
