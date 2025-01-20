import { Button, Popover, PopoverContent, PopoverTrigger, Slider } from "@heroui/react";
import { IoVolumeHighSharp } from "react-icons/io5";

const volumeSliderSize = 28;

export interface VolumeButtonProps {
    volume: number,
    maxVolume: number,
    onChange: (value: number | number[]) => void // TODO: Check Input value
}

export default function VolumeButton({ volume, onChange, maxVolume }: VolumeButtonProps) {
    return (
        <Popover placement="top">
            <PopoverTrigger>
                <Button isIconOnly>
                    <IoVolumeHighSharp size={volumeSliderSize} />
                </Button>
            </PopoverTrigger>

            <PopoverContent>
                <Slider
                    className="h-40"
                    aria-label="Volume"
                    value={volume}
                    onChange={onChange}
                    minValue={0}
                    maxValue={maxVolume}
                    step={0.01}
                    orientation="vertical"
                    size="lg"
                    />
            </PopoverContent>
        </Popover>
    );
}