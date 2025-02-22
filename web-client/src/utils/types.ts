export function isNumber(value: unknown): value is number {
    return typeof value === 'number';
}

export function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

export interface RangeIndex {
    startIndex: number;
    endIndex: number;
}

export interface Duration {
    hours: number;
    minutes: number;
    seconds: number;
}

export type DurationSeconds = number;
export const isDurationSeconds = isNumber;
