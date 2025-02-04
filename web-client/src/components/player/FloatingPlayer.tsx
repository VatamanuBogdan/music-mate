import { Button, Image, Slider } from '@heroui/react';
import { PropsWithChildren } from 'react';
import { IoPlay, IoPlaySkipBack, IoPlaySkipForward } from 'react-icons/io5';

import VolumeButton from './VolumeButton';
import { Track } from '../../types/Track';

const buttonRadius = 20;
const sliderLength = 120;

function PlaybackButton(
    props: {
        onPress?: () => void;
    } & PropsWithChildren
): JSX.Element {
    return (
        <Button
            className="bg-transparent bg-opacity-75 text-slate-300"
            radius="full"
            isIconOnly
            size="sm"
            onPress={props.onPress}
        >
            {props.children}
        </Button>
    );
}

interface FloatingPlayerProps {
    track: Track;
    defaultSeekOffset: number;
    defaultVolume: number;
    onBack?: () => void;
    onPlayToggle?: () => void;
    onNext?: () => void;
    onSeekChange?: (offset: number) => void;
    onVolumeChange?: (volume: number) => void;
}

export function FloatingPlayer({
    track,
    defaultSeekOffset,
    defaultVolume,
    onBack,
    onPlayToggle,
    onNext,
    onSeekChange,
    onVolumeChange,
}: FloatingPlayerProps): JSX.Element {
    function onSeekChangeWrapper(value: number | number[]) {
        if (!onSeekChange) {
            return;
        }

        if (value instanceof Array) {
            onSeekChange(value[value.length - 1]);
        } else {
            onSeekChange(value);
        }
    }

    return (
        <div className="flex flex-row justify-start w-96 h-32 rounded-lg bg-slate-800 backdrop-blur-md bg-opacity-50 select-none">
            <Image className="w-32 h-32" radius="md" src={track.imageUrl} />

            <div className="relative flex flex-col flex-grow justify-end items-center">
                <div className="self-stretch flex-grow ml-5 mt-4 space-y-[-3px]">
                    <h2 className="text-slate-300 max-w-40 text-base">{track.artist}</h2>
                    <h1 className="text-slate-200 max-w-40 text-xl font-bold">{track.name}</h1>
                </div>

                <div className="absolute top-2 right-2">
                    <VolumeButton
                        sliderPlacement="right-start"
                        size={buttonRadius}
                        sliderLength={sliderLength}
                        defaultVolume={defaultVolume}
                        onVolumeChange={onVolumeChange}
                    />
                </div>

                <div className="w-auto space-x-1 p-2">
                    <PlaybackButton onPress={onBack}>
                        <IoPlaySkipBack size={buttonRadius} />
                    </PlaybackButton>

                    <PlaybackButton onPress={onPlayToggle}>
                        <IoPlay size={buttonRadius} />
                    </PlaybackButton>

                    <PlaybackButton onPress={onNext}>
                        <IoPlaySkipForward size={buttonRadius} />
                    </PlaybackButton>
                </div>

                <div className="self-stretch mb-[-8px]">
                    <Slider
                        className="w-full accent-slate-100"
                        color="warning"
                        size="sm"
                        step={1}
                        minValue={0}
                        maxValue={track.duration}
                        defaultValue={defaultSeekOffset}
                        onChange={onSeekChangeWrapper}
                    />
                </div>
            </div>
        </div>
    );
}
