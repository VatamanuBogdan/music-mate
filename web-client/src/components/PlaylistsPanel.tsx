import { Button, Image, Spacer, Tab, Tabs } from "@heroui/react";
import { useState } from "react";
import { PlaylistMock, playlistMocks } from "../mocks/playlists";
import { FaMix, FaSpotify, FaYoutube } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

function PlaylistEntry(mock: PlaylistMock) {
    return (
        <div className="flex justify-between items-center h-24 ml-2 mr-2 bg-slate-900 rounded-lg cursor-pointer">
            <div className="ml-2 flex justify-start items-center">
                <Image
                    className="inline-block w-20 h-20 z-0"
                    radius="md"
                    src={mock.imageUrl}
                    />
                
                <div className="ml-3 space-y-[-2px]">
                    <div className="text-lg text-slate-200 font-bold">{mock.name}</div>
                    <div className="text-base text-slate-200">{mock.description}</div>
                </div>
            </div>

            <div className="text-slate-400 text-xs text-end font-medium mx-3 mt-3">
                <div>{mock.duration}</div>
                <div>{mock.songsCount} tracks</div>
            </div>
        </div>
    )
}

function PlaylistPanelHeader() {
    const platformIconSize = 32;

    return (
        <div className="flex flex-row justify-between h-20 items-center p-3 bg-slate-800  backdrop-blur-lg bg-opacity-50">
            <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-slate-100">
                    Playlists
                </span>

                <Button isIconOnly radius="full" size="sm" className="bg-slate-100 text-slate-900">
                    <FaPlus size={14} />
                </Button>
            </div>

            <Tabs color='default' radius="full" 
                    classNames={{
                        tabList: 'bg-trasparent',
                        tab: 'w-12 h-12',
                        cursor: 'bg-slate-200'
                    }}>
                    <Tab key="spotify" title={<FaSpotify size={platformIconSize}/>} />
                    <Tab key="youtube" title={<FaYoutube size={platformIconSize}/>} />
                    <Tab key="mix" title={<FaMix size={platformIconSize}/>} />
                </Tabs>
        </div>
    );
}

export default function PlaylistPanel() {
    const [playlists] = useState<PlaylistMock[]>(() => {
        return playlistMocks.concat(playlistMocks).concat(playlistMocks);
    });
    
    

    return (
        <div className="relative w-[484px] bg-slate-800 bg-opacity-75 rounded-tr-lg rounded-br-lg">
            
            <div className="absolute top-0 left-0 right-0 z-10">
                <PlaylistPanelHeader/>
            </div>
            
            <div className="z-0 space-y-1 max-h-[100vh] mr-2 overflow-y-auto">
                <Spacer key={"first-dummy"} y={20} />

                {
                    playlists?.map(playlist =>
                        <PlaylistEntry key={playlist.id} {...playlist} />
                    )
                }
                <Spacer key={"last-dummy"} y={40} />
            </div>
        </div>  
    );
}