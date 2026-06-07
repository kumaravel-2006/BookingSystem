import React from 'react';

export const mockMovies = [
  {
    id: 1,
    title: 'Cosmo Horizon',
    genre: 'Sci-Fi / Space Exploration',
    rating: 4.8,
    format: 'IMAX 3D',
    releaseDate: 'Now Showing',
    poster: '/poster_cosmic.png',
    description: 'An astronaut embarks on a dangerous journey beyond the edge of the galaxy to find a new habitable world for humanity.',
    trailerUrl: 'https://www.youtube.com/embed/8g18jFHCLbk',
    category: 'showing',
    ticketPrice: 15.50,
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    duration: '2h 15m',
    isHighDemand: false
  },
  {
    id: 2,
    title: 'Neon Syndicate',
    genre: 'Cyberpunk Noir',
    rating: 4.6,
    format: '2D / Dolby Atmos',
    releaseDate: 'Now Showing',
    poster: '/poster_cyberpunk.png',
    description: 'A cybernetically enhanced detective uncovers a deep corporate conspiracy hidden within a neon-drenched metropolis.',
    trailerUrl: 'https://www.youtube.com/embed/SF8R5Vn1VGs',
    category: 'showing',
    ticketPrice: 13.00,
    cast: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas'],
    duration: '2h 05m',
    isHighDemand: false
  },
  {
    id: 3,
    title: 'The Whispering Woods',
    genre: 'Fantasy / Adventure',
    rating: 4.5,
    format: 'RealD 3D',
    releaseDate: 'Coming Soon - June 22',
    poster: '/poster_fantasy.png',
    description: 'Two siblings discover an ancient portal hidden in their backyard that opens into a magical realm of mythical beasts.',
    trailerUrl: 'https://www.youtube.com/embed/jBdb2p2n-mI',
    category: 'coming_soon',
    ticketPrice: 14.00,
    cast: ['Georgie Henley', 'Skandar Keynes', 'William Moseley'],
    duration: '1h 58m',
    isHighDemand: false
  },
  {
    id: 4,
    title: 'Midnight Drive',
    genre: 'Action / Synthwave',
    rating: 4.2,
    format: '2D Digital',
    releaseDate: 'Coming Soon - July 4',
    poster: '/poster_retro.png',
    description: 'A legendary street racer is pulled back for one final heist along neon-lit retro coastal highways.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'coming_soon',
    ticketPrice: 12.00,
    cast: ['Ryan Gosling', 'Carey Mulligan', 'Bryan Cranston'],
    duration: '1h 40m',
    isHighDemand: false
  },
  {
    id: 5,
    title: 'Cosmo Horizon 2: Supernova',
    genre: 'Sci-Fi / Space Exploration',
    rating: 4.9,
    format: 'IMAX 3D',
    releaseDate: 'Trending',
    poster: '/poster_cosmic.png',
    description: 'The spectacular sequel to Cosmo Horizon, featuring star-destructing cosmic events, high gravity, and mind-bending physics.',
    trailerUrl: 'https://www.youtube.com/embed/8g18jFHCLbk',
    category: 'trending',
    ticketPrice: 16.50,
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Timothée Chalamet'],
    duration: '2h 30m',
    isHighDemand: true // Simulates the queue flow!
  },
  {
    id: 6,
    title: 'Neon Syndicate: Reboot',
    genre: 'Cyberpunk Noir',
    rating: 4.7,
    format: '2D / Dolby Atmos',
    releaseDate: 'Trending',
    poster: '/poster_cyberpunk.png',
    description: 'Explore the genesis of the cyberpunk corporate network in this gripping neon-themed prequel.',
    trailerUrl: 'https://www.youtube.com/embed/SF8R5Vn1VGs',
    category: 'trending',
    ticketPrice: 13.50,
    cast: ['Ryan Gosling', 'Harrison Ford', 'Jared Leto'],
    duration: '2h 10m',
    isHighDemand: false
  }
];

export const mockOffers = [
  {
    id: 1,
    tag: 'Weekend Deal',
    title: 'BOGO Movie Magic',
    desc: 'Buy 1 ticket, get the second ticket at 50% off on Sundays.',
    icon: 'ticket'
  },
  {
    id: 2,
    tag: 'Card Promo',
    title: '15% Off with CineCard',
    desc: 'Use your registered CinePass debit card and save 15% on snacks.',
    icon: 'card'
  },
  {
    id: 3,
    tag: 'Loyalty Reward',
    title: 'Free Popcorn Upgrade',
    desc: 'Redeem 100 reward points for a free Jumbo Popcorn tub upgrade.',
    icon: 'popcorn'
  }
];
