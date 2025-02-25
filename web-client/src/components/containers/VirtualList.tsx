import { ReactElement, useMemo, useRef, useState } from 'react';
import { RangeIndex, isArray } from 'utils/types';

interface ListItems<T> {
    length: number;
    at(index: number): T;
    map<U>(range: RangeIndex, callback: (item: T, index: number) => U): U[];
}

type InteractionArgs<T> = {
    item: T;
    index: number;
    target: HTMLElement;
};

type ItemComponent<T, D = undefined> = (props: { item: T; index: number; data: D }) => ReactElement;

interface VirtualListProps<T, D = undefined> {
    items: Array<T> | ListItems<T>;
    children: ItemComponent<T, D>;
    childrenKey: (item: T, index: number) => React.Key;
    childrenData: D;
    maxItemsCount?: number;
    overscan: number;
    sizes: {
        itemHeigth: number;
        listHeight: number;
    };
    spacing: {
        top?: number;
        bottom?: number;
        gap?: number;
        horizontalPadding?: number;
    };
    onItemClick?: (props: InteractionArgs<T>) => void;
    onItemHover?: (props: InteractionArgs<T> | null) => void;
    onScroll?: (range: RangeIndex) => void;
    onScrollEnd?: (range: RangeIndex) => void;
}

export default function VirtualList<T, D>({
    items,
    children,
    childrenData,
    maxItemsCount,
    childrenKey,
    overscan,
    sizes,
    spacing,
    onItemClick,
    onItemHover,
    onScroll,
    onScrollEnd,
}: VirtualListProps<T, D>): JSX.Element {
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
    const previousHoveredIndex = useRef<number | null>(null);

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

    function findItemIndexElement(target: EventTarget): InteractionArgs<T> | null {
        const item = (target as HTMLElement).closest('[data-vli-idx]');
        if (!item) {
            return null;
        }

        const stringIndex = item.getAttribute('data-vli-idx');
        if (!stringIndex) {
            return null;
        }

        const index = parseInt(stringIndex);
        return {
            index,
            target: target as HTMLElement,
            item: itemsSlice[index],
        };
    }

    function handledClick(e: React.MouseEvent<HTMLElement>) {
        if (!onItemClick) {
            return;
        }

        const props = findItemIndexElement(e.target);
        if (props) {
            onItemClick(props);
        }
    }

    function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
        if (!onItemHover) {
            return;
        }

        const props = findItemIndexElement(e.target);
        if (props) {
            onItemHover(props);
        }
    }

    function handleMouseLeave() {
        previousHoveredIndex.current = null;
        if (!onItemHover) {
            return;
        }
        onItemHover(null);
    }

    const renderedItems = itemsSlice.map((item, index) => {
        const key = childrenKey(item, startIndex + index);
        return (
            <li key={key} data-vli-idx={index} style={{ height: `${rowHeight}px` }}>
                {children({ item, index: startIndex + index, data: childrenData })}
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
                    paddingLeft: spacing.horizontalPadding ?? 0,
                    paddingRight: spacing.horizontalPadding ?? 0,
                }}
            >
                <div
                    style={{ transform: `translateY(${startIndex * rowHeight}px)` }}
                    onClick={onItemClick ? handledClick : undefined}
                    onMouseMove={onItemHover ? handleMouseMove : undefined}
                    onMouseLeave={onItemHover ? handleMouseLeave : undefined}
                >
                    {renderedItems}
                </div>
            </div>
        </ul>
    );
}

export type {
    ListItems as VirtualListItems,
    InteractionArgs as VirtualListInteractionArgs,
    ItemComponent as VirtualListItemComponent,
};
