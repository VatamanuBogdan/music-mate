import { mapPaginatedContent } from 'api/pagination';
import PlaylistApi from 'api/playlist';
import { Track, createTrack } from 'types/Track';

import usePaginatedQuery, { PaginatedQueryResult } from './usePaginatedQuery';

export default function usePlaylistTracks(
    playlistId: number | undefined,
    pageSize: number
): PaginatedQueryResult<Track> {
    return usePaginatedQuery<Track>({
        queryKey: ['playlist-tracks', playlistId],
        queryFn: async (pageParam) => {
            const page = await PlaylistApi.fetchPlaylistTracks(playlistId!, pageParam);
            return mapPaginatedContent(page, createTrack);
        },
        pageSize,
        enabled: !!playlistId,
    });
}
