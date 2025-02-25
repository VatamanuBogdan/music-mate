import useAddTrack from 'hooks/useAddTrack';
import usePlaylistTracks from 'hooks/usePlaylistTracks';
import useRemoveTrack from 'hooks/useRemoveTrack';
import useVhSizes from 'hooks/useVhSizes';
import useVirtualListAdapter from 'hooks/useVirtualListAdapter';
import { useSelectedPlaylist } from 'providers/SelectedPlaylistProvider';
import { useState } from 'react';
import { Track } from 'types/Track';
import { remToPx } from 'utils/transforms';

import TrackCard, { TrackCardAttribute } from './cards/TrackCard';
import VirtualList, {
    VirtualListInteractionArgs,
    VirtualListItemComponent,
} from './containers/VirtualList';
import TrackListHeader from './TrackListHeader';

const FETCH_PAGE_SIZE = 15;
const LIST_OVERSCAN = 5;

type CardData = {
    isRemovable: boolean;
    hoveredIndex: number | null;
};

const TrackCardAdapter: VirtualListItemComponent<Track, CardData> = ({ item, index, data }) => {
    return (
        <TrackCard
            track={item}
            index={index}
            isRemovable={data.isRemovable}
            isHovered={index === data.hoveredIndex}
        />
    );
};

export default function TrackList(): JSX.Element {
    const { selectedPlaylist } = useSelectedPlaylist();

    const {
        pages: tracksPages,
        fetchNextPage,
        isFetchingNextPage,
    } = usePlaylistTracks(selectedPlaylist?.id, FETCH_PAGE_SIZE);

    const [childrenData, setChildrenData] = useState<CardData>({
        isRemovable: false,
        hoveredIndex: null,
    });

    const items = useVirtualListAdapter(tracksPages);

    const addTrack = useAddTrack(selectedPlaylist?.id ?? 0);
    const removeTrack = useRemoveTrack(selectedPlaylist?.id);

    const [listHeight] = useVhSizes(100);

    function handleEditChange(enabled: boolean) {
        setChildrenData({
            ...childrenData,
            isRemovable: enabled,
        });
    }

    function handleItemClick({ item, target }: VirtualListInteractionArgs<Track>) {
        const value = TrackCardAttribute.closestValue(target);
        if (value === 'delete') {
            removeTrack(item.id);
        }
    }

    function handleItemHover(args: VirtualListInteractionArgs<Track> | null) {
        setChildrenData({
            ...childrenData,
            hoveredIndex: args?.index ?? null,
        });
    }

    function handleScrollEnd() {
        if (!isFetchingNextPage) {
            fetchNextPage();
        }
    }

    if (!selectedPlaylist) {
        return (
            <div className="flex w-full h-full flex-row items-center justify-center">
                No playlist selected
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-5rem)] w-full bg-slate-800 bg-opacity-70 scrollbar">
            <TrackListHeader
                title={selectedPlaylist.name}
                onAddTrack={(url) => addTrack(url)}
                onEditChange={handleEditChange}
            />
            <VirtualList
                items={items}
                childrenData={childrenData}
                childrenKey={(track) => track.id}
                overscan={LIST_OVERSCAN}
                sizes={{
                    listHeight: listHeight - remToPx(10),
                    itemHeigth: remToPx(4),
                }}
                spacing={{
                    top: remToPx(0.3),
                    gap: remToPx(0.3),
                    horizontalPadding: remToPx(0.5),
                }}
                onItemClick={handleItemClick}
                onItemHover={handleItemHover}
                onScrollEnd={handleScrollEnd}
            >
                {TrackCardAdapter}
            </VirtualList>
        </div>
    );
}
