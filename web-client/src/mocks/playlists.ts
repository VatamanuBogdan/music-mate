import { Playlist } from '../types/Playlist';

export const playlistMocks: Playlist[] = [
    {
        id: '1',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b273b95379557dbd1f0c30b7640e',
        name: 'Rock Playlist',
        description: 'Feel the rock essence',
        songsCount: 32,
        duration: 5520,
    },
    {
        id: '2',
        imageUrl:
            'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da845747f4b4e9c287e751884727',
        name: 'Good Vibes',
        description: 'Charge your battery',
        songsCount: 16,
        duration: 2700,
    },
    {
        id: '3',
        imageUrl:
            'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da843ebb4dac7d9face42e98f1b5',
        name: 'Electro Hits',
        description: 'Lose your mind and feel the vibe',
        songsCount: 24,
        duration: 8160,
    },
    {
        id: '4',
        imageUrl: 'https://i.scdn.co/image/ab67706f00000002d47ee07c9a62f7c11e589c70',
        name: 'Classic Oldies',
        songsCount: 43,
        duration: 9780,
    },
];
