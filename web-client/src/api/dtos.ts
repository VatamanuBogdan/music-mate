export interface CredentialsDto {
    email: string;
    password: string;
}

export type AuthTokenType = 'ACCESS' | 'REFRESH';

export interface AuthTokenDto {
    type: AuthTokenType;
    value: string;
}

export interface AccountInfosDto {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
}

export interface AuthenticationDto {
    token: AuthTokenDto;
    infos: AccountInfosDto;
}

export interface PlaylistCreationDto {
    name: string;
    description?: string;
}

export interface PlaylistDto {
    id: number;
    name: string;
    description?: string;
    thumbnail: boolean;
    tracksCount: number;
    duration: number;
}

export interface TrackSourceDto {
    platform: 'SPOTIFY' | 'YOUTUBE';
    value: string;
}

export interface TrackDto {
    id: number;
    name: string;
    artist: string;
    thumbnailUrl: string;
    durationSec: number;
    source: TrackSourceDto;
}
