import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PlaylistCreationDto } from 'api/dtos';
import PlaylistApi from 'api/playlist';

export default function useAddPlaylist(): (creation: PlaylistCreationDto) => Promise<void> {
    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation({
        mutationFn: PlaylistApi.addNewPlaylist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlist'] });
        },
    });

    return mutateAsync;
}
