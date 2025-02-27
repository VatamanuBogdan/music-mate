import useAddTrack from 'hooks/useAddTrack';
import usePlaylistTracks from 'hooks/usePlaylistTracks';
import useRemoveTrack from 'hooks/useRemoveTrack';
import useVhSizes from 'hooks/useVhSizes';
import useVirtualListAdapter from 'hooks/useVirtualListAdapter';
import { usePlayerActions, usePlayerStatus } from 'providers/PlayerProvider';
import { useSelectedPlaylist } from 'providers/SelectedPlaylistProvider';
import { useMemo, useState } from 'react';
import { Track } from 'types/Track';
import { remToPx } from 'utils/transforms';

import VirtualList, { VirtualListInteractionArgs, VirtualListItemComponent } from './VirtualList';
import TrackCard, { TrackCardAttribute } from '../cards/TrackCard';
import TrackListHeader from '../TrackListHeader';

const LIST_OVERSCAN = 5;

type CardData = {
    isRemovable: boolean;
    hoveredIndex: number | null;
    selectedTrack: Track | null;
};

const TrackCardAdapter: VirtualListItemComponent<Track, CardData> = ({ item, index, data }) => {
    return (
        <TrackCard
            track={item}
            index={index}
            isSelected={item.id === data.selectedTrack?.id}
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
    } = usePlaylistTracks(selectedPlaylist?.id);

    const { launch: playerLaunch } = usePlayerActions();
    const { track: selectedTrack } = usePlayerStatus();

    const [isRemovable, setRemoval] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const childrenData = useMemo(() => {
        return {
            isRemovable,
            hoveredIndex,
            selectedTrack,
        };
    }, [isRemovable, hoveredIndex, selectedTrack]);

    const items = useVirtualListAdapter(tracksPages);

    const addTrack = useAddTrack(selectedPlaylist?.id ?? 0);
    const removeTrack = useRemoveTrack(selectedPlaylist?.id);

    const [listHeight] = useVhSizes(100);

    function handleEditChange(enabled: boolean) {
        setRemoval(enabled);
    }

    function handleItemClick({ item, index, target }: VirtualListInteractionArgs<Track>) {
        const value = TrackCardAttribute.closestValue(target);
        switch (value) {
            case 'play':
                if (selectedPlaylist) {
                    playerLaunch(selectedPlaylist, index);
                }
                break;
            case 'delete':
                removeTrack(item.id);
                break;
        }
    }

    function handleItemHover(args: VirtualListInteractionArgs<Track> | null) {
        setHoveredIndex(args?.index ?? null);
    }

    function handleScrollEnd() {
        if (!isFetchingNextPage) {
            fetchNextPage();
        }
    }

    if (!selectedPlaylist) {
        return (
            <div className="flex w-full h-full flex-row items-center justify-center text-2xl font-bold text-slate-200 bg-slate-800 bg-opacity-70 ">
                No playlist selected
            </div>
        );
    }

    const isPlaylistEmpty = items.length === 0 && isFetchingNextPage === false;

    return (
        <div className="h-[calc(100vh-5rem)] w-full bg-slate-800 bg-opacity-70 scrollbar">
            <TrackListHeader
                title={selectedPlaylist.name}
                onAddTrack={(url) => addTrack(url)}
                onEditChange={handleEditChange}
            />
            {isPlaylistEmpty ? (
                <div className="h-full flex flex-row justify-center items-center text-2xl font-bold text-slate-200">
                    Empty Playlist
                </div>
            ) : (
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
            )}
        </div>
    );
}
