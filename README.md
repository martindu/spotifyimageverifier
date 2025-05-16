# Spotify Image Verifier

A Next.js application that compares user-provided album artwork with Spotify's official artwork using perceptual hashing.

## Features

- Input song name and base64-encoded image
- Fetch official artwork from Spotify API
- Compare images using perceptual hashing
- Display similarity percentage
- Show track information (name and artist)

## Prerequisites

- Node.js 18+ and pnpm
- Spotify Developer Account with API credentials

## Setup

1. Clone the repository:
```bash
git clone https://github.com/martindu/spotifyimageverifier.git
cd spotifyimageverifier
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file in the root directory with your Spotify API credentials:
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

4. Start the development server:
```bash
pnpm dev
```

The application will be available at http://localhost:3000

## Usage

1. Enter a song name in the input field
2. Paste a base64-encoded image in the text area
3. Click "Compare Images"
4. View the results:
   - User-provided image
   - Spotify's official artwork
   - Similarity percentage
   - Track information

## Technologies Used

- Next.js 15.2.4
- React 19
- TypeScript
- Tailwind CSS
- Spotify Web API
- Perceptual Hashing for Image Comparison

## License

MIT 