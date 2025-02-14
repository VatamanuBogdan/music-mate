import { ReactElement, useEffect, useRef, useState } from 'react';
import { RangeIndex } from 'utils/types';

export interface VirtualizedListItems<T> {
    map<U>(range: RangeIndex, callback: (item: T, index: number) => U): U[];
}

interface VirtualizedListProps<T> {
    items: T[] | VirtualizedListItems<T>;
    maxItemsCount: number;
    callbacks: {
        fetchItems: (range: RangeIndex) => void;
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
}

export default function VirtualizedList<T>({
    items,
    maxItemsCount,
    callbacks: { fetchItems, renderItem, itemKey },
    overscan,
    sizes,
    spacing,
}: VirtualizedListProps<T>): JSX.Element {
    const [scrollTopDistance, setScrollTopDistance] = useState(0);

    const rowHeight = sizes.itemHeigth + (spacing.gap ?? 0);
    const topSpace = spacing.top ?? 0;
    const bottomSpace = spacing.bottom ?? 0;

    function computeItemsRange(scrollTopDistance: number): RangeIndex {
        const start = Math.floor(scrollTopDistance / rowHeight) - overscan;
        const end = start + Math.floor(sizes.listHeight / rowHeight) + 2 * overscan;

        return {
            startIndex: Math.max(0, start),
            endIndex: Math.min(end, maxItemsCount),
        };
    }

    const currentRange = computeItemsRange(scrollTopDistance);
    const previousRangeRef = useRef<RangeIndex | null>();

    const { startIndex, endIndex } = currentRange;

    useEffect(() => {
        const previousRange = previousRangeRef.current;
        if (
            previousRange &&
            previousRange.startIndex === startIndex &&
            previousRange.endIndex === endIndex
        ) {
            return;
        }

        previousRangeRef.current = { startIndex, endIndex };
        fetchItems({ startIndex, endIndex });
    }, [fetchItems, startIndex, endIndex]);

    function renderListRow(item: T, index: number): JSX.Element {
        return (
            <li key={itemKey(item, index)} style={{ height: `${rowHeight}px` }}>
                {renderItem(item, index)}
            </li>
        );
    }

    let renderedItems: JSX.Element[];
    if (!Array.isArray(items)) {
        renderedItems = items.map({ startIndex, endIndex }, (item, index) => {
            return renderListRow(item, index);
        });
    } else {
        renderedItems = items.slice(startIndex, endIndex + 1).map((item, index) => {
            return renderListRow(item, index);
        });
    }

    return (
        <ul
            style={{ height: sizes.listHeight, overflowY: 'auto' }}
            onScroll={(e) => setScrollTopDistance(e.currentTarget.scrollTop)}
        >
            <div
                style={{
                    height: maxItemsCount * rowHeight,
                    marginTop: topSpace,
                    marginBottom: bottomSpace,
                }}
            >
                <div style={{ transform: `translateY(${startIndex * rowHeight}px)` }}>
                    {renderedItems}
                </div>
            </div>
        </ul>
    );
}
