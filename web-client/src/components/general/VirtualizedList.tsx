import { ReactElement, useEffect, useRef, useState } from 'react';

interface ScrollRange {
    startIndex: number;
    endIndex: number;
}

interface ScrollItem<D> {
    key: React.Key;
    data: D;
}

interface VirtualizedListProps<D> {
    items: ScrollItem<D>[];
    maxItemsCount: number;
    fetchItems: (range: ScrollRange) => void;
    item: {
        height: number;
        gap?: number;
        factory: (i: ScrollItem<D>, index: number) => ReactElement;
    };
    window: {
        height: number;
        overscan: number;
    };
}

export default function VirtualizedList<D>({
    items,
    maxItemsCount,
    fetchItems,
    item,
    window,
}: VirtualizedListProps<D>): JSX.Element {
    const [scrollTopDistance, setScrollTopDistance] = useState(0);

    const rowHeight = item.height + (item.gap ?? 0);

    function computeItemsRange(scrollTopDistance: number): ScrollRange {
        const start = Math.floor(scrollTopDistance / rowHeight);
        const end = start + Math.floor(window.height / rowHeight) + 2 * window.overscan;

        return {
            startIndex: Math.max(0, start),
            endIndex: Math.min(end, maxItemsCount),
        };
    }

    const currentRange = computeItemsRange(scrollTopDistance);
    const previousRangeRef = useRef<ScrollRange | null>();

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

    const renderedItems = items.slice(startIndex, endIndex).map((i, index) => {
        return (
            <li key={i.key} style={{ height: `${rowHeight}px` }}>
                {item.factory(i, index)}
            </li>
        );
    });

    return (
        <ul
            style={{ height: `${window.height}px`, overflowY: 'auto' }}
            onScroll={(e) => setScrollTopDistance(e.currentTarget.scrollTop)}
        >
            <div style={{ height: `${maxItemsCount * rowHeight}px` }}>
                <div style={{ transform: `translateY(${startIndex * rowHeight}px)` }}>
                    {renderedItems}
                </div>
            </div>
        </ul>
    );
}
