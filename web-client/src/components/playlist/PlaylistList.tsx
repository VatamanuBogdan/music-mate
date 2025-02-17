import { PlaylistDto } from 'api/dtos';
import { PlaylistCard } from 'components/cards/PlaylistCard';
import VirtualizedList from 'components/general/VirtualizedList';
import usePlaylistsQuery from 'hooks/usePlaylistsQuery';
import useVhSizes from 'hooks/useVhSizes';
import { ReactElement, useMemo } from 'react';
import { VirtualizedListPaginatedItems } from 'utils/adapters';
import { FixedPagesFlattener } from 'utils/page-flattener';
import { remToPx } from 'utils/transforms';
import { RangeIndex } from 'utils/types';

const playlistPageSize = 10;
const listOverscan = 5;

export default function PlaylistList(): JSX.Element {
    const { playlistPages, playlistCount, fetchNextPage, isFetchingNextPage } =
        usePlaylistsQuery(playlistPageSize);

    const items = useMemo(() => {
        const flattener = new FixedPagesFlattener(playlistPages, playlistPageSize);
        return new VirtualizedListPaginatedItems(flattener);
    }, [playlistPages]);

    const [listHeight] = useVhSizes(100);

    return (
        <div className="max-h-[100vh] scrollbar">
            {
                <VirtualizedList
                    items={items}
                    maxItemsCount={playlistCount}
                    callbacks={{
                        fetchItems: (range: RangeIndex) => {
                            if (
                                !isFetchingNextPage ||
                                range.endIndex > playlistPages.length * playlistPageSize
                            ) {
                                fetchNextPage();
                            }
                        },
                        renderItem: (playlist: PlaylistDto): ReactElement => {
                            return <PlaylistCard playlist={playlist} />;
                        },
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
                />
            }
        </div>
    );
}
