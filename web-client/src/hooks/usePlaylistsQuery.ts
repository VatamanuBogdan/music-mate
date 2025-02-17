import { useInfiniteQuery } from '@tanstack/react-query';
import { PlaylistDto } from 'api/dtos';
import { Paginated } from 'api/pagination';
import PlaylistApi from 'api/playlist';

interface PlaylistQueryResult {
    playlistPages: Paginated<PlaylistDto>[];
    playlistCount: number;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
}

export default function usePlaylistsQuery(pageSize: number): PlaylistQueryResult {
    const query = useInfiniteQuery({
        queryKey: ['playlist', pageSize],
        queryFn: ({ pageParam }) => PlaylistApi.fetchPlaylists(pageParam),
        initialPageParam: { page: 0, size: pageSize },
        getNextPageParam: (lastPage) => {
            if (lastPage.page >= lastPage.pageCount - 1) {
                return null;
            }

            return { page: lastPage.page + 1, size: pageSize };
        },
    });

    return {
        playlistPages: query.data?.pages ?? [],
        fetchNextPage: query.fetchNextPage,
        playlistCount: query.data?.pages[0].totalSize ?? 0,
        isFetchingNextPage: query.isFetchingNextPage,
    };
}
