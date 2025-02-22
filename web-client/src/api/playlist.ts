import { AxiosRequestConfig } from 'axios';

import { requestApi } from './client';
import { PlaylistCreationDto, PlaylistDto, TrackDto } from './dtos';
import { PaginatedPromise, PaginationParam } from './pagination';

const PLAYLIST_ENDPOINT = 'playlists';
const PLAYLIST_TRACKS_ENDPOINT = `${PLAYLIST_ENDPOINT}/tracks`;

async function fetchPlaylists(params: PaginationParam): PaginatedPromise<PlaylistDto> {
    const config: AxiosRequestConfig = {
        method: 'get',
        url: PLAYLIST_ENDPOINT,
        params,
    };

    return requestApi(config);
}

async function addNewPlaylist(props: PlaylistCreationDto): Promise<void> {
    const config: AxiosRequestConfig = {
        method: 'post',
        url: PLAYLIST_ENDPOINT,
        data: props,
    };

    return requestApi<void>(config);
}

async function fetchPlaylistTracks(
    playlistId: number,
    params: PaginationParam
): PaginatedPromise<TrackDto> {
    const config: AxiosRequestConfig = {
        method: 'get',
        url: PLAYLIST_TRACKS_ENDPOINT,
        params: { playlistId, ...params },
    };

    return requestApi(config);
}

export default {
    fetchPlaylists,
    addNewPlaylist,
    fetchPlaylistTracks,
};
