
type MusicMateLogoSize = 'sm' | 'md' | 'lg'

interface MusicMateLogoProps {
    size: MusicMateLogoSize
}

function getClassesBySize(size: MusicMateLogoSize): string {
    switch (size) {
        case 'sm':
            return 'px-3 py-1 text-4xl';
        case 'md':
            return 'px-4 py-2 text-6xl';
        case 'lg':
            return 'px-4 py-2 text-8xl';
    }
}

export default function MusicMateLogo({ size }: MusicMateLogoProps) {
    return (
        <h1 className={`text-slate-900 ${getClassesBySize(size)} font-bold border-2 border-slate-800 rounded-md`}> 
            Music Mate
        </h1> 
    )
}