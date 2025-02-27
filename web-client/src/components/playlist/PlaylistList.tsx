import { PlaylistCard } from 'components/cards/PlaylistCard';
import VirtualList, { VirtualListItemComponent } from 'components/containers/VirtualList';
import usePlaylists from 'hooks/usePlaylists';
import useVhSizes from 'hooks/useVhSizes';
import useVirtualListAdapter from 'hooks/useVirtualListAdapter';
import { useSelectedPlaylist } from 'providers/SelectedPlaylistProvider';
import { Playlist } from 'types/Playlist';
import { remToPx } from 'utils/transforms';

const LIST_OVERSCAN = 10;

const PlaylistCardAdapter: VirtualListItemComponent<Playlist> = ({ item }) => {
    return <PlaylistCard playlist={item} />;
};

export default function PlaylistList(): JSX.Element {
    const { pages: playlistPages, fetchNextPage, isFetchingNextPage } = usePlaylists();

    const { selectPlaylist } = useSelectedPlaylist();

    const items = useVirtualListAdapter(playlistPages);

    const [listHeight] = useVhSizes(100);

    return (
        <div className="max-h-[100vh] scrollbar">
            {
                <VirtualList
                    items={items}
                    childrenData={undefined}
                    childrenKey={(playlist) => playlist.id}
                    overscan={LIST_OVERSCAN}
                    sizes={{
                        listHeight: listHeight - remToPx(5),
                        itemHeigth: remToPx(6),
                    }}
                    spacing={{
                        top: remToPx(0.5),
                        bottom: remToPx(10.0),
                        gap: remToPx(0.3),
                    }}
                    onItemClick={({ item: playlist }) => selectPlaylist(playlist)}
                    onScrollEnd={() => {
                        if (!isFetchingNextPage) {
                            fetchNextPage();
                        }
                    }}
                >
                    {PlaylistCardAdapter}
                </VirtualList>
            }
        </div>
    );
}
