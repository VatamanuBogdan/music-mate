export interface TrackMock {
    id: string;
    name: string;
    artist: string;
    imageUrl: string;
    duration: string
}

export const trackMocks: TrackMock[] = [
    {
        id: '1',
        name: 'St. Anger',
        artist: 'Metallica',
        imageUrl: 'https://cdn.media.amplience.net/i/metallica/st-anger_cover?fmt=auto&maxW=1050',
        duration: '5:48'
    },
    {
        id: '2',
        name: 'Dangerous',
        artist: 'David Guetta',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b27322f21ef4e9da48c31170a418',
        duration: '3:24'
    }
]