import TrackList from "../components/TrackList"
import Track from "../types/Track"

const mockedTracks: Track[] = [
    {
        id: '1',
        name: "Alien",
        artist: "Denis Loyd",
        url: new URL('https://www.youtube.com/watch?v=tyHdtifvQz8'),
        source: 'Youtube'
    },
    {
        id: '2',
        name: "I Don't Wanna Wait",
        artist: "David Guetta",
        url: new URL('https://www.youtube.com/watch?v=dSDbwfXX5_I'),
        source: 'Youtube'
    },
    {
        id: '3',
        name: "St Anger",
        artist: "Metallica",
        url: new URL('https://www.youtube.com/watch?v=6ajl1ABdD8A'),
        source: 'Youtube'
    },
    {
        id: '4',
        name: "Runaway",
        artist: "Bon Jovi",
        url: new URL('https://www.youtube.com/watch?v=s86K-p089R8'),
        source: 'Youtube'
    },
]


export default function YoutubeTracksPage() {
    return TrackList({ tracks: mockedTracks })
}