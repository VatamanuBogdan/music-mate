import { useDisclosure } from '@heroui/react';
import AddPlaylistModal from 'components/playlist/PlaylistAddModal';
import PlaylistHeader from 'components/playlist/PlaylistsHeader';

import PlaylistList from './PlaylistList';

export default function PlaylistPanel(): JSX.Element {
    const playlistAddModalDisc = useDisclosure();

    return (
        <div className="relative w-[30rem] bg-slate-800 bg-opacity-75 overflow-visible">
            <div className="absolute top-0 left-0 right-0 z-10">
                <PlaylistHeader
                    height="h-20"
                    defaultSource="spotify"
                    onAddPress={playlistAddModalDisc.onOpenChange}
                    onSourceChange={(s) => {
                        console.log(`Playlist source changed to ${s}`);
                    }}
                />
            </div>

            <AddPlaylistModal
                isOpen={playlistAddModalDisc.isOpen}
                onOpenChange={playlistAddModalDisc.onOpenChange}
            />

            <PlaylistList />
        </div>
    );
}
