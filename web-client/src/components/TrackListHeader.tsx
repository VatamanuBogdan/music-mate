import { Button, Input, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MdModeEditOutline } from 'react-icons/md';

const EDIT_ICON_SIZE = 20;
const ADD_ICON_SIZE = 14;

interface TrackListHeaderProps {
    title: string;
    onAddTrack?: (url: string) => void;
    onEditChange?: (enabled: boolean) => void;
}

export default function TrackListHeader({
    title,
    onAddTrack,
    onEditChange,
}: TrackListHeaderProps): JSX.Element {
    const [trackUrl, setTrackUrl] = useState('');
    const editEnabledRef = useRef(false);

    return (
        <div className="flex flex-row items-center justify-between w-full px-6 h-20 bg-slate-800 bg-opacity-50">
            <div className="space-x-4">
                <span className="text-4xl font-bold text-slate-100">{title}</span>
                <Button
                    isIconOnly
                    size="sm"
                    radius="full"
                    onPress={() => {
                        editEnabledRef.current = !editEnabledRef.current;
                        onEditChange?.(editEnabledRef.current);
                    }}
                >
                    <MdModeEditOutline size={EDIT_ICON_SIZE} />
                </Button>
            </div>

            <Popover placement="left" onClose={() => setTrackUrl('')}>
                <PopoverTrigger>
                    <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        className="bg-slate-100 text-slate-900"
                    >
                        <FaPlus size={ADD_ICON_SIZE} />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="flex flex-row items-center p-2">
                    <Input
                        className="w-96"
                        value={trackUrl}
                        onValueChange={setTrackUrl}
                        label="Youtube/Spotify URL"
                        size="md"
                        type="url"
                    />
                    <Button size="md" onPress={() => onAddTrack?.(trackUrl)}>
                        <h1 className="text-lg font-bold">Add</h1>
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    );
}
