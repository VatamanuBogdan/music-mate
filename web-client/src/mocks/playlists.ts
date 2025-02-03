interface PlaylistMock {
    id: string,
    imageUrl: string;
    name: string;
    description?: string;
    songsCount: number;
    duration: string;
}

const playlistMocks: PlaylistMock[] = [
    {
        id: '1',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b273b95379557dbd1f0c30b7640e',
        name: 'Rock Playlist',
        description: 'Feel the rock essence',
        songsCount: 32,
        duration: '1h 32m'
    },
    {
        id: '2',
        imageUrl: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da845747f4b4e9c287e751884727',
        name: 'Good Vibes',
        description: 'Charge your battery',
        songsCount: 16,
        duration: '45m'
    },
    {
        id: '3',
        imageUrl: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da843ebb4dac7d9face42e98f1b5',
        name: 'Electro Hits',
        description: 'Lose your mind and feel the vibe',
        songsCount: 24,
        duration: '2h 16m'
    },
    {
        id: '4',
        imageUrl: 'https://i.scdn.co/image/ab67706f00000002d47ee07c9a62f7c11e589c70',
        name: 'Classic Oldies',
        songsCount: 43,
        duration: '2h 43m'
    }
]

export { playlistMocks };
export type { PlaylistMock };
