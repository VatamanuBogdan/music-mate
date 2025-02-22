import { PlaylistCard } from 'components/cards/PlaylistCard';
import VirtualizedList from 'components/containers/VirtualizedList';
import usePlaylists from 'hooks/usePlaylists';
import useVhSizes from 'hooks/useVhSizes';
import useVirtualizedListItems from 'hooks/useVirtualListPages';
import { useSelectedPlaylist } from 'providers/SelectedPlaylistProvider';
import { remToPx } from 'utils/transforms';

const playlistPageSize = 10;
const listOverscan = 5;

export default function PlaylistList(): JSX.Element {
    const {
        pages: playlistPages,
        fetchNextPage,
        isFetchingNextPage,
    } = usePlaylists(playlistPageSize);

    const { selectPlaylist } = useSelectedPlaylist();

    const items = useVirtualizedListItems(playlistPages, playlistPageSize);

    const [listHeight] = useVhSizes(100);

    return (
        <div className="max-h-[100vh] scrollbar">
            {
                <VirtualizedList
                    items={items}
                    itemRendering={{
                        renderItem: (playlist) => <PlaylistCard playlist={playlist} />,
                        itemKey: (playlist) => playlist.id,
                    }}
                    overscan={listOverscan}
                    sizes={{
                        listHeight: listHeight,
                        itemHeigth: remToPx(6),
                    }}
                    spacing={{
                        top: remToPx(5.3),
                        bottom: remToPx(10.0),
                        gap: remToPx(0.3),
                    }}
                    onSelect={selectPlaylist}
                    onScrollEnd={() => {
                        if (!isFetchingNextPage) {
                            fetchNextPage();
                        }
                    }}
                />
            }
        </div>
    );
}
