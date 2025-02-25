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

export interface DataAttribute<T extends string> {
    readonly name: string;
    value(element: HTMLElement): T | null;
    closestValue(element: HTMLElement): T | null;
    set(value: T): Record<string, T>;
}

class DataAttributeImpl<T extends string> implements DataAttribute<T> {
    public readonly name: string;
    private selector: string;

    constructor(name: string) {
        if (name.startsWith('data-')) {
            this.name = name;
        } else {
            this.name = `data-${name}`;
        }

        this.selector = `[${this.name}]`;
    }

    public value(element: HTMLElement): T | null {
        return element.getAttribute(this.name) as T;
    }

    public closestValue(element: HTMLElement): T | null {
        const newElement = element.closest(this.selector);
        return (newElement?.getAttribute(this.name) ?? null) as T;
    }

    public set(value: T): Record<string, T> {
        return { [this.name]: value };
    }
}

export function createDataAttribute<T extends string = string>(name: string): DataAttribute<T> {
    return new DataAttributeImpl<T>(name);
}
