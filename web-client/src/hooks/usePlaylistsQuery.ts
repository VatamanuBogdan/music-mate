import { useInfiniteQuery } from '@tanstack/react-query';
import { PlaylistDto } from 'api/dtos';
import { PaginatedQueryResult } from 'api/pagination';
import PlaylistApi from 'api/playlist';

export default function usePlaylistsQuery(pageSize: number): PaginatedQueryResult<PlaylistDto> {
    return useInfiniteQuery({
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
}
