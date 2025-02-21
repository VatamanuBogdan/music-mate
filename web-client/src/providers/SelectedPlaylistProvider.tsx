import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';
import { Playlist } from 'types/Playlist';

type SelectedPlaylistContextType = {
    selectedPlaylist: Playlist | null;
    selectPlaylist: (playlist: Playlist | null) => void;
};

const SelectedPlaylistContext = createContext<SelectedPlaylistContextType | undefined>(undefined);

export const useSelectedPlaylist = (): SelectedPlaylistContextType => {
    const context = useContext(SelectedPlaylistContext);
    if (!context) {
        throw Error(`useSelectedPlaylist must be used within a SelectedPlaylistProvider`);
    }
    return context;
};

export default function SelectedPlaylistProvider({ children }: PropsWithChildren): JSX.Element {
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

    const value = useMemo(() => {
        return {
            selectedPlaylist,
            selectPlaylist: setSelectedPlaylist,
        };
    }, [selectedPlaylist]);

    return (
        <SelectedPlaylistContext.Provider value={value}>
            {children}
        </SelectedPlaylistContext.Provider>
    );
}
