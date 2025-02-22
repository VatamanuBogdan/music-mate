import { TrackDto } from 'api/dtos';
import { transformSeconds } from 'utils/helpers';
import { Duration } from 'utils/types';

type TrackPlatform = 'youtube' | 'spotify';

interface TrackBase<P extends TrackPlatform> {
    platform: P;
    id: number;
    name: string;
    artist: string;
    thumbnailUrl: string;
    duration: Duration;
}

export interface YoutubeTrack extends TrackBase<'youtube'> {
    videoId: string;
}

export interface SpotifyTrack extends TrackBase<'spotify'> {
    songUrl: string;
}

export type Track = YoutubeTrack | SpotifyTrack;

export function createTrack(dto: TrackDto): Track {
    const base = {
        id: dto.id,
        name: dto.name,
        artist: dto.artist,
        thumbnailUrl: dto.thumbnailUrl,
        duration: transformSeconds(dto.durationSec),
    };

    switch (dto.source.platform) {
        case 'SPOTIFY':
            return {
                platform: 'spotify',
                songUrl: dto.source.value,
                ...base,
            };
        case 'YOUTUBE':
            return {
                platform: 'youtube',
                videoId: dto.source.value,
                ...base,
            };
    }
}
