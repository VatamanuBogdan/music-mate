import { Button, Image } from '@heroui/react';

import { Track } from '../../types/Track';
import { formatTrackDuration } from '../../utils/helpers';

interface TrackCardProps {
    track: Track;
    index: number;
}

export default function TrackCard({ index, track }: TrackCardProps): JSX.Element {
    return (
        <Button className="bg-slate-800 bg-opacity-85 h-16" radius="md" fullWidth>
            <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-row justify-start items-center w-full space-x-4">
                    <span className="text-slate-200 text-base text-right font-bold w-9">
                        {index}.
                    </span>
                    <Image width={48} height={48} src={track.imageUrl} />

                    <span className="align-baseline space-x-2">
                        <span className="text-lg text-slate-200 font-medium">{track.name}</span>
                        <span className="text-base text-slate-300 ">{track.artist}</span>
                    </span>
                </div>

                <div className="text-slate-200 text-base font-medium">
                    {formatTrackDuration(track.duration)}
                </div>
            </div>
        </Button>
    );
}
