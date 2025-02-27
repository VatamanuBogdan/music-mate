import { PlayerState } from '@youtube-player/api';
import {
    YoutubePlayer,
    YoutubePlayerProvider,
    useApiPlayerListener,
    usePlayerController,
    usePlayerPlay,
    usePlayerVolume,
} from '@youtube-player/react';
import useFlattenedPages from 'hooks/useFlattenedPages';
import usePlaylistTracks from 'hooks/usePlaylistTracks';
import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Playlist } from 'types/Playlist';
import { Track } from 'types/Track';

const PLAYER_PROGRESS_REFRESH_TIME = 1000;

type PlayerStatusType = {
    playlist: Playlist | null;
    track: Track | null;
    isPlaying: boolean;
    volume: number;
};

type PlayerActionsContextType = {
    launch: (playlist: Playlist, startTrackIndex: number) => void;
    play(): void;
    pause(): void;
    togglePlay(): void;
    backward(): void;
    forward(): void;
    progressTo(value: number): void;
    setVolume(value: number): void;
};

type PlayerTimelineType = {
    progress: number;
    duration: number;
};

const PlayerStatusContext = createContext<PlayerStatusType | undefined>(undefined);
const PlayerActionsContext = createContext<PlayerActionsContextType | undefined>(undefined);
const PlayerTimelineContext = createContext<PlayerTimelineType | undefined>(undefined);

export const usePlayerStatus = (): PlayerStatusType => {
    const context = useContext(PlayerStatusContext);
    if (!context) {
        throw Error(`usePlayerPlaylist must be used within a PlayerProvider`);
    }
    return context;
};

export const usePlayerActions = (): PlayerActionsContextType => {
    const context = useContext(PlayerActionsContext);
    if (!context) {
        throw Error(`usePlayerActions must be used within a PlayerProvider`);
    }
    return context;
};

export const usePlayerTimeline = (): PlayerTimelineType => {
    const context = useContext(PlayerTimelineContext);
    if (!context) {
        throw Error(`usePlayerTimeline must be used within a PlayerProvider`);
    }
    return context;
};

function PlayerProviderImpl({ children }: PropsWithChildren): JSX.Element {
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [trackIndex, setTrackIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    const playerController = usePlayerController();

    const [playing] = usePlayerPlay();
    const [volume] = usePlayerVolume();

    const { pages } = usePlaylistTracks(playlist?.id);
    const flattenedPages = useFlattenedPages(pages);
    const flattenedPagesLength = flattenedPages.length;

    const previousTrack = useRef<Track>();
    let currentTrack: Track | null = null;

    if (trackIndex < flattenedPages.length) {
        currentTrack = flattenedPages.at(trackIndex);
    }

    function loadAndPlayTrack(track: Track) {
        if (track.platform === 'youtube') {
            playerController.loadVideoById(track.videoId);
        } else {
            console.error('Spotify track management was not implemented');
        }
    }

    if (currentTrack && currentTrack.id !== previousTrack.current?.id) {
        previousTrack.current = currentTrack;
        loadAndPlayTrack(currentTrack);
    }

    useApiPlayerListener(
        'onStateChange',
        (value) => {
            if (value.data === PlayerState.ENDED && trackIndex < flattenedPagesLength - 1) {
                setProgress(0);
                setTrackIndex(trackIndex + 1);
            }
        },
        [flattenedPagesLength]
    );

    useEffect(() => {
        const intervalId = setInterval(() => {
            setProgress(playerController.progress);
        }, PLAYER_PROGRESS_REFRESH_TIME);

        return () => {
            clearInterval(intervalId);
        };
    }, [playerController]);

    const playerStatus = useMemo(() => {
        return {
            playlist,
            track: currentTrack,
            isPlaying: playing === 'Playing',
            volume,
        };
    }, [playlist, currentTrack, playing, volume]);

    const playerActions = useMemo(() => {
        function launch(playlist: Playlist, trackIndex: number) {
            setPlaylist(playlist);
            setTrackIndex(trackIndex);
        }

        function togglePlay() {
            const playing = playerController.playing;
            playerController.playing = playing === 'Playing' ? 'Paused' : 'Playing';
        }

        function forward() {
            setTrackIndex((index) => (index < flattenedPagesLength - 1 ? index + 1 : index));
        }

        function backward() {
            setTrackIndex((index) => (index > 0 ? index - 1 : index));
        }

        function progressTo(value: number) {
            setProgress(value);
            playerController.progress = value;
        }

        return {
            launch,
            forward,
            backward,
            play: () => (playerController.playing = 'Playing'),
            pause: () => (playerController.playing = 'Paused'),
            togglePlay,
            progressTo,
            setVolume: (value: number) => (playerController.volume = value),
        };
    }, [playerController, flattenedPagesLength]);

    return (
        <div>
            <div className="hidden fixed top-0 right-0 pointer-events-none">
                <YoutubePlayer
                    width={64}
                    height={64}
                    autoplay={false}
                    barColor={'red'}
                    displayControls={false}
                    disableKeyboardInteraction={true}
                    disableFullscreen={true}
                    showVideoAnnotations={false}
                    showRelatedVideos={false}
                />
            </div>

            <PlayerStatusContext.Provider value={playerStatus}>
                <PlayerActionsContext.Provider value={playerActions}>
                    <PlayerTimelineContext.Provider
                        value={{ progress, duration: playerController.duration }}
                    >
                        {children}
                    </PlayerTimelineContext.Provider>
                </PlayerActionsContext.Provider>
            </PlayerStatusContext.Provider>
        </div>
    );
}

export default function PlayerProvider({ children }: PropsWithChildren): JSX.Element {
    return (
        <YoutubePlayerProvider>
            <PlayerProviderImpl>{children}</PlayerProviderImpl>
        </YoutubePlayerProvider>
    );
}
