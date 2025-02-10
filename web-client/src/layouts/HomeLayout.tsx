import PlaylistPanel from 'components/playlist/PlaylistsPanel';

import AccountAvatar from '../components/AccountAvatar';
import NavigationBar from '../components/NavigationBar';
import { FloatingPlayer } from '../components/player/FloatingPlayer';
import TrackList from '../components/TrackList';
import { trackMocks } from '../mocks/tracks';

export default function HomeLayout(): JSX.Element {
    return (
        <div className="flex flex-row justify-start items-stretch h-screen w-screen bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
            <PlaylistPanel />

            <div className="flex-grow h-screen flex flex-col justify-center bg-teal-900 bg-opacity-50 items-center">
                <NavigationBar />
                <div className="flex-grow self-stretch">
                    <TrackList />
                </div>
            </div>

            <div className="z-10 fixed bottom-0 left-0 p-4">
                <FloatingPlayer track={trackMocks[0]} defaultSeekOffset={0} defaultVolume={50} />
            </div>

            <div className="fixed bottom-0 right-0 p-4">
                <AccountAvatar />
            </div>
        </div>
    );
}
