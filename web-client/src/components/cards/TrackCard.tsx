import { Image } from '@heroui/react';
import { FaPlay } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { createDataAttribute } from 'utils/types';

import { Track } from '../../types/Track';
import { formatTrackDuration } from '../../utils/helpers';

const PLAY_ICON_SIZE = 14;
const DELETE_ICON_SIZE = 22;

interface TrackCardProps {
    track: Track;
    index: number;
    isSelected?: boolean;
    isHovered?: boolean;
    isRemovable?: boolean;
}

export const attr = createDataAttribute<'play' | 'delete'>('track-card');

export default function TrackCard({
    index,
    track,
    isSelected,
    isHovered,
    isRemovable,
}: TrackCardProps): JSX.Element {
    const background = `${isHovered || isSelected ? 'bg-slate-700 ' : 'bg-slate-800'} bg-opacity-85`;

    return (
        <div
            {...attr.set('play')}
            className={`flex flex-row items-center h-16 w-full px-2 ${background}  text-slate-200 rounded-lg cursor-pointer select-none`}
        >
            <div className="flex flex-row justify-start items-center flex-grow space-x-4">
                <div className="h-6 w-10 flex flex-row items-center justify-end">
                    {isHovered ? (
                        <FaPlay size={PLAY_ICON_SIZE} />
                    ) : (
                        <div className="font-medium">{index}.</div>
                    )}
                </div>

                <Image className="w-12 h-12 object-cover" src={track.thumbnailUrl} />

                <div className="flex flex-row space-x-2 items-baseline">
                    <div className="text-lg font-medium max-w-64 truncate">{track.name}</div>
                    <div className="text-base text-slate-300 max-w-52 truncate">{track.artist}</div>
                </div>
            </div>

            <div className="text-base">{formatTrackDuration(track.duration)}</div>

            <div {...attr.set('delete')} className="ml-2 w-6 h-6">
                {isRemovable === true && (
                    <button className="text-red-400">
                        <MdDelete size={DELETE_ICON_SIZE} />
                    </button>
                )}
            </div>
        </div>
    );
}

export { attr as TrackCardAttribute };
