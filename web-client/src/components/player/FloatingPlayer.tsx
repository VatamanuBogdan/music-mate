import { Button, Image, Popover, PopoverContent, PopoverTrigger, Slider } from "@heroui/react";
import { IoPlaySkipBack, IoPlay, IoPlaySkipForward, IoVolumeHigh } from "react-icons/io5";

export function FloatingPlayer(): JSX.Element {
    const buttonSize = 18;
    const buttonClass = 'bg-transparent bg-opacity-75 text-slate-300'

    return (
        <div className="flex flex-row justify-start w-96 h-32 rounded-lg bg-slate-800 backdrop-blur-md bg-opacity-50 select-none">
            <Image
                className="w-32 h-32 shrink-0"
                radius="md"
                src="https://cdn.media.amplience.net/i/metallica/st-anger_cover?fmt=auto&maxW=1050"
                />

            <div className="relative flex flex-col flex-grow justify-end items-center">
                
                <div className="self-stretch flex-grow ml-5 mt-4 space-y-[-3px]">
                    <h2 className="text-slate-300 text-base">Metallica</h2>
                    <h1 className="text-slate-200 text-xl font-bold">St. Anger</h1>
                </div>

                <div className="absolute text-slate-300 top-2 right-2">
                    <Popover placement="right-start"
                        classNames={{
                            content: 'bg-transparent'
                        }}
                    >
                        <PopoverTrigger>
                            <span><IoVolumeHigh size={buttonSize}/></span>
                        </PopoverTrigger>

                        <PopoverContent>
                            <Slider
                                className="h-[120px]"
                                orientation="vertical"
                                color="warning" 
                                minValue={0} 
                                maxValue={100} 
                                step={1}
                                size="lg"
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="w-auto space-x-1 p-2">
                    <Button 
                        className={buttonClass}
                        radius='full'
                        isIconOnly
                        size="sm"
                        >  
                        <IoPlaySkipBack size={buttonSize}/>
                    </Button>

                    <Button 
                        className={buttonClass} 
                        radius='full' 
                        isIconOnly
                        size="sm"
                        >
                        <IoPlay size={buttonSize} />
                    </Button>

                    <Button 
                        className={buttonClass}
                        radius='full' 
                        isIconOnly
                        size="sm"
                        >
                        <IoPlaySkipForward size={buttonSize}/>
                    </Button>
                </div>
                
                <div className="self-stretch mb-[-8px]">
                    <Slider
                        color='warning'
                        className="w-full accent-slate-100"
                        defaultValue={0.2}
                        maxValue={1}
                        minValue={0}
                        step={0.01}
                        size="sm"/>
                </div>
            </div>
        </div>
    );
}