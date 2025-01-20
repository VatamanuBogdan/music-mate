import { Duration } from "./types";

interface Identifiable<I> {
    id: I
}

interface IdentifiableValue<I, V> extends Identifiable<I> {
    value: V
}

export function isNumber(value: unknown): boolean {
    return typeof value === 'number';
}

export function transformSeconds(duration: number): Duration {
    
    duration = Math.floor(duration);

    const seconds = duration % 60;
    const minutes = Math.floor(duration / 60) % 60;
    const hours = Math.floor(minutes / 60);
    
    return { hours, minutes, seconds }
}

export function formatPlayerDuration(duration: Duration | number): string {

    let d: Duration
    if (isNumber(duration)) {
        d = transformSeconds(duration as number);
    } else {
        d = duration as Duration;
    }

    const formattedSeconds = d.seconds.toString().padStart(2, '0');
    const formattedMinutes = d.minutes.toString().padStart(2, '0');

    if (d.hours > 0) {
        const formattedHours = d.hours.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    } else {
        return `${formattedMinutes}:${formattedSeconds}`;
    }
}

export type {
    Identifiable,
    IdentifiableValue
}
