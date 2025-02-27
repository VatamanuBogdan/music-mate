import PlaylistApi from 'api/playlist';
import { Playlist } from 'types/Playlist';

import usePaginatedQuery, { PaginatedQueryResult } from './usePaginatedQuery';

const PAGE_SIZE = 50;

export default function usePlaylists(): PaginatedQueryResult<Playlist> {
    return usePaginatedQuery({
        queryKey: ['playlist'],
        queryFn: (pageParam) => PlaylistApi.fetchPlaylists(pageParam),
        pageSize: PAGE_SIZE,
    });
}
