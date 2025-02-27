import { OverlayPlacement } from '@heroui/aria-utils';
import { Popover, PopoverContent, PopoverTrigger, Slider } from '@heroui/react';
import { IoVolumeHigh } from 'react-icons/io5';

interface VolumeButtonProps {
    size: number;
    sliderLength: number;
    sliderPlacement?: OverlayPlacement;
    volume?: number;
    onVolumeChange?: (volume: number) => void;
}

export default function VolumeButton({
    size,
    sliderLength,
    sliderPlacement,
    volume,
    onVolumeChange,
}: VolumeButtonProps): JSX.Element {
    function onChangeWrapper(value: number | number[]) {
        if (!onVolumeChange) {
            return;
        }

        if (value instanceof Array) {
            onVolumeChange(value[value.length - 1]);
        } else {
            onVolumeChange(value);
        }
    }

    return (
        <Popover
            placement={sliderPlacement}
            classNames={{
                content: 'bg-transparent',
                trigger: 'text-slate-300',
            }}
        >
            <PopoverTrigger>
                <button>
                    <IoVolumeHigh size={size} />
                </button>
            </PopoverTrigger>

            <PopoverContent>
                <Slider
                    aria-label="Volume"
                    style={{ height: sliderLength }}
                    orientation="vertical"
                    color="warning"
                    size="lg"
                    step={1}
                    minValue={0}
                    maxValue={100}
                    value={volume}
                    onChange={onChangeWrapper}
                />
            </PopoverContent>
        </Popover>
    );
}
