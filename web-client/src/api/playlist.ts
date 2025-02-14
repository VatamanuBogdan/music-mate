import { AxiosRequestConfig } from 'axios';

import { requestApi } from './client';
import { PlaylistCreationDto, PlaylistDto } from './dtos';
import { PaginatedPromise, PaginationParam } from './pagination';

const ENDPOINT_BASE = 'playlists';

async function fetchPlaylists(params: PaginationParam): PaginatedPromise<PlaylistDto> {
    const config: AxiosRequestConfig = {
        method: 'get',
        url: ENDPOINT_BASE,
        params,
    };

    return requestApi(config);
}

async function addNewPlaylist(props: PlaylistCreationDto): Promise<void> {
    const config: AxiosRequestConfig = {
        method: 'post',
        url: ENDPOINT_BASE,
        data: props,
    };

    return await requestApi<void>(config);
}

export default {
    fetchPlaylists,
    addNewPlaylist,
};
