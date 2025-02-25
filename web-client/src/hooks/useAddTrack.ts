import { useMutation, useQueryClient } from '@tanstack/react-query';
import PlaylistApi from 'api/playlist';
import { createTrackSource } from 'utils/helpers';

export default function useAddTrack(playlistId?: number): (url: string) => void {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (url: string) => {
            if (!playlistId) {
                return Promise.reject(0);
            }
            const source = createTrackSource(url);
            if (source) {
                return PlaylistApi.addPlaylistTrack(playlistId, source);
            } else {
                return Promise.reject(new Error('Invalid track source URL'));
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['playlist-tracks', playlistId] });
        },
    });

    return mutation.mutate;
}
