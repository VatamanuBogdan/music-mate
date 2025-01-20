import { useMemo } from "react"
import { formatPlayerDuration } from "../../utils/helpers"
import { Slider } from "@heroui/react"

export interface MediaTimelineProps {
    progressInSeconds: number
    durationInSeconds: number
    onChange?: (progress: number | number[]) => void // TODO: Check Input value
}

export default function MediaTimeline({ progressInSeconds, durationInSeconds, onChange }: MediaTimelineProps) {
    const timingClassName = 'text-center font-medium w-10'
    
    const progress = useMemo(() => {
        return formatPlayerDuration(progressInSeconds);
    }, [progressInSeconds])

    const duration = useMemo(() => {
        return formatPlayerDuration(durationInSeconds);
    }, [durationInSeconds]);

    return (
        <div className="flex justify-center items-center space-x-3">
            <span className={timingClassName}>{progress}</span>
            <Slider
                className="w-96"
                aria-label="Media Timeline"
                value={progressInSeconds}
                minValue={0}
                maxValue={durationInSeconds}
                onChange={onChange}
                step={0.01}
                orientation="horizontal"
                size="md"
                />
            <span className={timingClassName}>{duration}</span>
        </div>
    )
}