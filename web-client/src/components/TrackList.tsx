import usePlaylistTracks from 'hooks/usePlaylistTracks';
import useVhSizes from 'hooks/useVhSizes';
import useVirtualizedListItems from 'hooks/useVirtualListPages';
import { useSelectedPlaylist } from 'providers/SelectedPlaylistProvider';
import { remToPx } from 'utils/transforms';

import TrackCard from './cards/TrackCard';
import VirtualizedList from './containers/VirtualizedList';

const tracksPageSize = 10;
const listOverscan = 5;

export default function TrackList(): JSX.Element {
    const { selectedPlaylist } = useSelectedPlaylist();

    const {
        pages: tracksPages,
        fetchNextPage,
        isFetchingNextPage,
    } = usePlaylistTracks(selectedPlaylist?.id, tracksPageSize);

    const items = useVirtualizedListItems(tracksPages, tracksPageSize);

    const [listHeight] = useVhSizes(100);

    return (
        <div className="h-[calc(100vh-5rem)] w-full px-2 bg-slate-700 bg-opacity-75 scrollbar">
            <VirtualizedList
                items={items}
                itemRendering={{
                    renderItem: (track, index) => <TrackCard track={track} index={index} />,
                    itemKey: (track) => track.id,
                }}
                overscan={listOverscan}
                sizes={{
                    listHeight: listHeight - remToPx(5),
                    itemHeigth: remToPx(4),
                }}
                spacing={{
                    gap: remToPx(0.3),
                }}
                onScrollEnd={() => {
                    if (!isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
            />
        </div>
    );
}
