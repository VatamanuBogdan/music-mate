type MusicMateLogoSize = 'sm' | 'md' | 'lg';

interface MusicMateLogoProps {
    size: MusicMateLogoSize;
    theme?: 'dark' | 'light';
}

function getClassesBySize(size: MusicMateLogoSize): string {
    switch (size) {
        case 'sm':
            return 'px-3 py-1 border-3 text-4xl';
        case 'md':
            return 'px-4 py-2 border-2 text-6xl';
        case 'lg':
            return 'px-4 py-2 border-2 text-8xl';
    }
}

export default function MusicMateLogo({ size, theme }: MusicMateLogoProps): JSX.Element {
    const textColor = theme === 'dark' ? 'text-slate-100' : 'text-slate-800';
    const borderColor = theme === 'dark' ? 'border-slate-100' : 'border-slate-800';

    return (
        <h1
            className={`${textColor} ${getClassesBySize(size)} font-bold ${borderColor} rounded-md select-none`}
        >
            Music Mate
        </h1>
    );
}
