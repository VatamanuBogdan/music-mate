import { Button, Slider } from '@heroui/react';
import { usePlayerActions, usePlayerStatus, usePlayerTimeline } from 'providers/PlayerProvider';
import { PropsWithChildren } from 'react';
import { IoPause, IoPlay, IoPlaySkipBack, IoPlaySkipForward } from 'react-icons/io5';
import { isArray } from 'utils/types';

import VolumeButton from './VolumeButton';

const PLAYBACK_ICON_SIZE = 23;
const PLAYBACK_PAUSE_ICON_SIZE = 25;
const sliderLength = 120;

function PlaybackButton(
    props: {
        onPress?: () => void;
    } & PropsWithChildren
): JSX.Element {
    return (
        <Button
            className="bg-transparent text-slate-300"
            radius="full"
            isIconOnly
            size="md"
            onPress={props.onPress}
        >
            {props.children}
        </Button>
    );
}

export function FloatingPlayer(): JSX.Element {
    const playerStatus = usePlayerStatus();
    const playerActions = usePlayerActions();
    const playerProgress = usePlayerTimeline();

    const track = playerStatus.track;

    if (!track) {
        return <></>;
    }

    return (
        <div className="flex flex-row justify-start w-[27rem] h-[9rem] rounded-lg bg-slate-800 backdrop-blur-md bg-opacity-50 select-none">
            <img
                className="w-[9rem] h-[9rem] object-cover rounded-tl-lg rounded-bl-lg"
                src={track.thumbnailUrl}
            />

            <div className="relative flex flex-col flex-grow justify-end items-center">
                <div className="self-stretch flex-grow ml-5 mt-4 space-y-[-3px]">
                    <h2 className="text-slate-300 max-w-[14rem] truncate text-base">
                        {track.artist}
                    </h2>
                    <h1 className="text-slate-200 max-w-[16rem] truncate text-xl font-bold">
                        {track.name}
                    </h1>
                </div>

                <div className="absolute top-2 right-2">
                    <VolumeButton
                        sliderPlacement="right-start"
                        size={PLAYBACK_ICON_SIZE}
                        sliderLength={sliderLength}
                        volume={playerStatus.volume}
                        onVolumeChange={playerActions.setVolume}
                    />
                </div>

                <div className="flex flex-row justify-center items-center space-x-1 p-2 ">
                    <PlaybackButton onPress={playerActions.backward}>
                        <IoPlaySkipBack size={PLAYBACK_ICON_SIZE} />
                    </PlaybackButton>

                    <PlaybackButton
                        onPress={() => {
                            playerActions.togglePlay();
                        }}
                    >
                        {playerStatus.isPlaying ? (
                            <IoPause size={PLAYBACK_PAUSE_ICON_SIZE} />
                        ) : (
                            <IoPlay size={PLAYBACK_ICON_SIZE} />
                        )}
                    </PlaybackButton>

                    <PlaybackButton onPress={playerActions.forward}>
                        <IoPlaySkipForward size={PLAYBACK_ICON_SIZE} />
                    </PlaybackButton>
                </div>

                <div className="self-stretch mb-[-8px]">
                    <Slider
                        aria-label="Player Timeline"
                        className="w-full accent-slate-100"
                        color="warning"
                        size="sm"
                        step={1}
                        minValue={0}
                        maxValue={playerProgress.duration}
                        value={playerProgress.progress}
                        onChange={(value) => {
                            playerActions.pause();
                            playerActions.progressTo(
                                isArray(value) ? value[value.length - 1] : value
                            );
                        }}
                        onChangeEnd={() => {
                            playerActions.play();
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
