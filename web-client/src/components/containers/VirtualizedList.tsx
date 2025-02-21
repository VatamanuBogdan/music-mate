import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { RangeIndex } from 'utils/types';

export interface VirtualizedListItems<T> {
    at(index: number): T;
    map<U>(range: RangeIndex, callback: (item: T, index: number) => U): U[];
}

interface VirtualizedListProps<T> {
    items: Array<T> | VirtualizedListItems<T>;
    maxItemsCount: number;
    itemHandlers: {
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
    onSelect?: (item: T, index: number) => void;
}

export default function VirtualizedList<T>({
    items,
    maxItemsCount,
    itemHandlers: { fetchItems, renderItem, itemKey },
    overscan,
    sizes,
    spacing,
    onSelect,
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

    const itemsSlice = useMemo(() => {
        if (!Array.isArray(items)) {
            return items.map({ startIndex, endIndex }, (item) => item);
        } else {
            return items.slice(startIndex, endIndex + 1);
        }
    }, [items, startIndex, endIndex]);

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
