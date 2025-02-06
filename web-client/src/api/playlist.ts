import { requestApi } from "./client";
import { PlaylistDto } from "./dtos";

const ENDPOINT_BASE = "playlists"

async function fetchPlaylists(): Promise<PlaylistDto[]> {
    const config = {
        method: 'get',
        url: ENDPOINT_BASE,
    }

    return requestApi<PlaylistDto[]>(config);
}

export default {
    fetchPlaylists
}