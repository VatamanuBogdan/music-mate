import { ReactElement, useMemo, useRef, useState } from 'react';
import { RangeIndex, isArray } from 'utils/types';

export interface VirtualizedListItems<T> {
    length: number;
    at(index: number): T;
    map<U>(range: RangeIndex, callback: (item: T, index: number) => U): U[];
}

interface VirtualizedListProps<T> {
    items: Array<T> | VirtualizedListItems<T>;
    maxItemsCount?: number;
    itemRendering: {
        renderItem: (item: T, index: number) => ReactElement;
        itemKey: (item: T, index: number) => React.Key;
    };
    overscan: number;
    sizes: {
        itemHeigth: number;
        listHeight: number;
    };
    spacing: {
        top?: number;
        bottom?: number;
        gap?: number;
    };
    onSelect?: (item: T, index: number) => void;
    onScroll?: (range: RangeIndex) => void;
    onScrollEnd?: (range: RangeIndex) => void;
}

export default function VirtualizedList<T>({
    items,
    maxItemsCount,
    itemRendering: { renderItem, itemKey },
    overscan,
    sizes,
    spacing,
    onSelect,
    onScroll,
    onScrollEnd,
}: VirtualizedListProps<T>): JSX.Element {
    const [scrollTopDistance, setScrollTopDistance] = useState(0);

    const rowHeight = sizes.itemHeigth + (spacing.gap ?? 0);
    const scrollEndIndex = (maxItemsCount ?? items.length) - 1;

    function computeItemsRange(scrollTopDistance: number): RangeIndex {
        const start = Math.floor(scrollTopDistance / rowHeight) - overscan;
        const end = start + Math.floor(sizes.listHeight / rowHeight) + 2 * overscan;

        return {
            startIndex: Math.max(0, start),
            endIndex: Math.min(end, scrollEndIndex),
        };
    }

    const { startIndex, endIndex } = computeItemsRange(scrollTopDistance);
    const previousRangeRef = useRef<RangeIndex>({ startIndex, endIndex });

    const itemsSlice = useMemo(() => {
        if (!isArray(items)) {
            return items.map({ startIndex, endIndex }, (item) => item);
        } else {
            return items.slice(startIndex, endIndex + 1);
        }
    }, [items, startIndex, endIndex]);

    function handleScrollChange(e: React.UIEvent<HTMLUListElement, UIEvent>) {
        const scrollTopDistance = e.currentTarget.scrollTop;
        const currentRange = computeItemsRange(scrollTopDistance);

        setScrollTopDistance(scrollTopDistance);
        const previousRange = previousRangeRef.current;
        if (
            previousRange.startIndex === currentRange.startIndex &&
            previousRange.endIndex === currentRange.endIndex
        ) {
            return;
        }
        previousRangeRef.current = currentRange;

        if (onScroll) {
            onScroll(currentRange);
        }

        if (onScrollEnd && endIndex === scrollEndIndex) {
            onScrollEnd(currentRange);
        }
    }

    function handledItemSelection(e: React.MouseEvent<HTMLElement>) {
        if (!onSelect) {
            return;
        }

        const item = (e.target as HTMLElement).closest('[v-li-index]');
        if (!item) {
            return;
        }

        const stringIndex = item.getAttribute('v-li-index');
        if (stringIndex) {
            const index = parseInt(stringIndex);
            onSelect(itemsSlice[index], index);
        }
    }

    const renderedItems = itemsSlice.map((item, index) => {
        const key = itemKey(item, startIndex + index);
        return (
            <li key={key} v-li-index={index} style={{ height: `${rowHeight}px` }}>
                {renderItem(item, startIndex + index)}
            </li>
        );
    });

    return (
        <ul style={{ height: sizes.listHeight, overflowY: 'auto' }} onScroll={handleScrollChange}>
            <div
                style={{
                    height: (scrollEndIndex + 1) * rowHeight,
                    marginTop: spacing.top ?? 0,
                    marginBottom: spacing.bottom ?? 0,
                }}
            >
                <div
                    style={{ transform: `translateY(${startIndex * rowHeight}px)` }}
                    onClick={onSelect ? handledItemSelection : undefined}
                >
                    {renderedItems}
                </div>
            </div>
        </ul>
    );
}
