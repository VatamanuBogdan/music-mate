import { AxiosHeaders, AxiosRequestConfig } from 'axios';

import { Duration, DurationSeconds, isDurationSeconds } from './types';

type BuildType = 'developement' | 'production';

let buildType: BuildType | undefined;
export function getBuildType(): BuildType {
    if (!buildType) {
        if (import.meta.env.MODE === 'development') {
            buildType = 'developement';
        } else {
            buildType = 'production';
        }
    }

    return buildType;
}

export interface Identifiable<I> {
    id: I;
}

export interface IdentifiableValue<I, V> extends Identifiable<I> {
    value: V;
}

export function applyAccessTokenTo(accessToken: string, requestConfig: AxiosRequestConfig): void {
    if (!requestConfig.headers) {
        requestConfig.headers = new AxiosHeaders();
    }

    requestConfig.headers.Authorization = `Bearer ${accessToken}`;
}

export function isNumber(value: unknown): boolean {
    return typeof value === 'number';
}

export function transformSeconds(duration: number): Duration {
    duration = Math.floor(duration);

    const seconds = duration % 60;
    const minutes = Math.floor(duration / 60) % 60;
    const hours = Math.floor(minutes / 60);

    return { hours, minutes, seconds };
}

export function formatPlaylistDuration(seconds: number): string {
    const { hours, minutes } = transformSeconds(seconds);
    if (hours > 0) {
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    } else {
        return `${minutes}m`;
    }
}

export function formatTrackDuration(duration: DurationSeconds | Duration): string {
    const {
        hours: h,
        minutes: m,
        seconds: s,
    } = isDurationSeconds(duration) ? transformSeconds(duration) : duration;

    return `${h > 0 ? ` ${h}h` : ''} ${m > 0 ? ` ${m}m` : ''} ${s > 0 ? ` ${s}s` : ''}`;
}

export function formatPlayerDuration(duration: Duration | number): string {
    let d: Duration;
    if (isNumber(duration)) {
        d = transformSeconds(duration as number);
    } else {
        d = duration as Duration;
    }

    const formattedSeconds = d.seconds.toString().padStart(2, '0');
    const formattedMinutes = d.minutes.toString().padStart(2, '0');

    if (d.hours > 0) {
        const formattedHours = d.hours.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
        return `${formattedMinutes}:${formattedSeconds}`;
    }
}

export function binarySearch(arr: number[], value: number): number {
    let startIndex = 0;
    let endIndex = arr.length - 1;
    while (startIndex <= endIndex) {
        const midIndex = Math.floor((endIndex + startIndex) / 2);
        if (arr[midIndex] === value) {
            return midIndex;
        } else if (arr[midIndex] > value) {
            endIndex = midIndex - 1;
        } else {
            startIndex = midIndex + 1;
        }
    }
    return startIndex;
}
