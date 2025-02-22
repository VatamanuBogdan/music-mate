import PlaylistApi from 'api/playlist';
import { Playlist } from 'types/Playlist';

import usePaginatedQuery, { PaginatedQueryResult } from './usePaginatedQuery';

export default function usePlaylists(pageSize: number): PaginatedQueryResult<Playlist> {
    return usePaginatedQuery({
        queryKey: ['playlist'],
        queryFn: (pageParam) => PlaylistApi.fetchPlaylists(pageParam),
        pageSize,
    });
}
