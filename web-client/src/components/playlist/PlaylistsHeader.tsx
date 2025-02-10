import { Button, Tab, Tabs } from '@heroui/react';
import { FaCompactDisc, FaPlus, FaSpotify, FaYoutube } from 'react-icons/fa';

const sourceIconSize = 32;
const addPlaylistIconSize = 14;

type PlaylistSource = 'spotify' | 'youtube' | 'mixed';

interface PlaylistHeaderProps {
    height: string;
    defaultSource: PlaylistSource;
    onAddPress?: () => void;
    onSourceChange?: (source: PlaylistSource) => void;
}

export default function PlaylistHeader({
    height,
    defaultSource,
    onSourceChange,
    onAddPress,
}: PlaylistHeaderProps): JSX.Element {
    return (
        <div
            className={`${height} h-20 px-3 flex flex-row justify-between items-center bg-slate-800 backdrop-blur-lg bg-opacity-50`}
        >
            <div className="flex flex-row items-center space-x-3">
                <span className="text-3xl font-bold text-slate-100">Playlists</span>

                <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    className="bg-slate-100 text-slate-900"
                    onPress={onAddPress}
                >
                    <FaPlus size={addPlaylistIconSize} />
                </Button>
            </div>

            <Tabs
                color="default"
                radius="full"
                classNames={{
                    tabList: 'bg-trasparent',
                    tab: 'w-12 h-12',
                    cursor: 'bg-slate-200',
                }}
                defaultSelectedKey={defaultSource}
                onSelectionChange={(s) => onSourceChange?.(s as PlaylistSource)}
            >
                <Tab key="spotify" title={<FaSpotify size={sourceIconSize} />} />
                <Tab key="youtube" title={<FaYoutube size={sourceIconSize} />} />
                <Tab key="mixed" title={<FaCompactDisc size={sourceIconSize} />} />
            </Tabs>
        </div>
    );
}
