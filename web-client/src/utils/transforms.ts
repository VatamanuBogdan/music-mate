import { Duration } from './types';

export function vhToPx(vh: number): number {
    return (vh * window.innerHeight) / 100;
}

export function remToPx(rem: number): number {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function durationToSeconds(d: Duration): number {
    return d.hours * 3600 + d.minutes * 60 + d.seconds;
}
