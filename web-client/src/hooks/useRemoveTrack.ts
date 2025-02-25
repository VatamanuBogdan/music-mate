import { useMutation, useQueryClient } from '@tanstack/react-query';
import PlaylistApi from 'api/playlist';

export default function useRemoveTrack(playlistId?: number): (trackId: number) => void {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (trackId: number) => {
            if (!playlistId) {
                return Promise.resolve();
            }
            return PlaylistApi.removePlaylistTrack(playlistId, trackId);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['playlist-tracks', playlistId] });
        },
    });

    return mutation.mutate;
}
