export function vhToPx(vh: number): number {
    return (vh * window.innerHeight) / 100;
}

export function remToPx(rem: number): number {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
