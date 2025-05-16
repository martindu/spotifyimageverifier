"use server"

import { decode } from "./base64"

// Spotify API credentials
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

// Types
type SpotifyTokenResponse = {
  access_token: string
  token_type: string
  expires_in: number
}

type SpotifyTrack = {
  album: {
    images: Array<{
      url: string
      height: number
      width: number
    }>
  }
  name: string
  artists: Array<{
    name: string
  }>
}

type SpotifyAlbum = {
  images: Array<{
    url: string
    height: number
    width: number
  }>
  name: string
  artists: Array<{
    name: string
  }>
}

type SpotifySearchResponse = {
  tracks: {
    items: SpotifyTrack[]
  }
}

// Get Spotify access token
async function getSpotifyToken(): Promise<string> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error("Spotify API credentials are not configured")
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to get Spotify access token")
  }

  const data: SpotifyTokenResponse = await response.json()
  return data.access_token
}

// Search for a track by name
async function searchTrack(songName: string): Promise<SpotifyTrack | null> {
  const token = await getSpotifyToken()
  
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(songName)}&type=track&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to search for track")
  }

  const data: SpotifySearchResponse = await response.json()
  return data.tracks.items[0] || null
}

// Extract Spotify ID from base64
function extractSpotifyId(base64String: string): { type: "track" | "album"; id: string } {
  try {
    // Try to decode the base64 string
    const decoded = decode(base64String)

    // Look for Spotify track or album IDs in the decoded string
    const trackMatch = decoded.match(/spotify:track:([a-zA-Z0-9]+)/)
    if (trackMatch && trackMatch[1]) {
      return { type: "track", id: trackMatch[1] }
    }

    const albumMatch = decoded.match(/spotify:album:([a-zA-Z0-9]+)/)
    if (albumMatch && albumMatch[1]) {
      return { type: "album", id: albumMatch[1] }
    }

    // If the base64 string itself looks like a Spotify ID
    if (base64String.match(/^[a-zA-Z0-9]{22}$/)) {
      // Assume it's a track ID if we can't determine
      return { type: "track", id: base64String }
    }

    throw new Error("No valid Spotify ID found in the base64 string")
  } catch (error) {
    throw new Error("Failed to decode base64 string or extract Spotify ID")
  }
}

// Fetch artwork from Spotify
export async function fetchSpotifyArt(base64String: string, songName?: string): Promise<{ imageUrl: string; trackInfo?: { name: string; artist: string } }> {
  try {
    let trackData: SpotifyTrack | null = null

    // If song name is provided, search for the track
    if (songName) {
      trackData = await searchTrack(songName)
    }

    // If no track found by name, try to extract ID from base64
    if (!trackData) {
      const { type, id } = extractSpotifyId(base64String)
      const token = await getSpotifyToken()

      const endpoint = type === "track" 
        ? `https://api.spotify.com/v1/tracks/${id}`
        : `https://api.spotify.com/v1/albums/${id}`

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} data from Spotify`)
      }

      trackData = await response.json()
    }

    if (!trackData) {
      throw new Error("No track data found")
    }

    // Extract image URL and track info
    const images = trackData.album.images
    if (!images || images.length === 0) {
      throw new Error("No artwork found for this item")
    }

    return {
      imageUrl: images[0].url,
      trackInfo: {
        name: trackData.name,
        artist: trackData.artists.map(a => a.name).join(", ")
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("An unknown error occurred")
  }
}
