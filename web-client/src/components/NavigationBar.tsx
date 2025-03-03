import MusicMateLogo from './MusicMateLogo';

export default function NavigationBar(): JSX.Element {
    return (
        <div className="flex justify-end items-center w-full h-20 px-2 bg-slate-800 backdrop-blur-lg bg-opacity-50">
            <div className="my-3">
                <MusicMateLogo size="sm" theme="dark" />
            </div>
        </div>
    );
}
