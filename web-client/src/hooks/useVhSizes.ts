import { useEffect, useRef, useState } from 'react';
import { vhToPx } from 'utils/transforms';

export default function useVhSizes(...vhs: number[]): number[] {
    const vhsSizesRef = useRef(vhs);
    const [transformedSizes, setTransformedSizes] = useState(() => {
        return vhs.map((vh) => vhToPx(vh));
    });

    useEffect(() => {
        const handleWindowResize = () => {
            setTransformedSizes(vhsSizesRef.current.map((vh) => vhToPx(vh)));
        };

        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    return transformedSizes;
}
