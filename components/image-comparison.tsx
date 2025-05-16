"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { fetchSpotifyArt } from "@/lib/spotify"
import { calculateImageSimilarity } from "@/lib/image-comparison"

export function ImageComparison() {
  const [songName, setSongName] = useState("")
  const [base64Input, setBase64Input] = useState("")
  const [userImage, setUserImage] = useState<string | null>(null)
  const [spotifyImage, setSpotifyImage] = useState<string | null>(null)
  const [trackInfo, setTrackInfo] = useState<{ name: string; artist: string } | null>(null)
  const [similarity, setSimilarity] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleBase64Input = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setBase64Input(value)
    
    try {
      // Try to decode and display the image
      const imageUrl = `data:image/jpeg;base64,${value}`
      setUserImage(imageUrl)
    } catch (err) {
      setError("Invalid base64 image data")
      setUserImage(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSimilarity(null)
    setTrackInfo(null)

    try {
      // Fetch Spotify data
      const spotifyData = await fetchSpotifyArt(base64Input, songName)
      setSpotifyImage(spotifyData.imageUrl)
      if (spotifyData.trackInfo) {
        setTrackInfo(spotifyData.trackInfo)
      }

      // Calculate similarity between images
      if (userImage && spotifyData.imageUrl) {
        const similarityScore = await calculateImageSimilarity(userImage, spotifyData.imageUrl)
        setSimilarity(similarityScore)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process images")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="song-name" className="text-sm font-medium">
            Song Name
          </label>
          <Input
            id="song-name"
            placeholder="Enter the song name..."
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="base64-input" className="text-sm font-medium">
            Base64 Image Data
          </label>
          <Textarea
            id="base64-input"
            placeholder="Paste your base64-encoded image data here..."
            value={base64Input}
            onChange={handleBase64Input}
            className="min-h-[120px] font-mono text-sm"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || !base64Input.trim() || !songName.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>Compare Images</>
          )}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {trackInfo && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Track Information</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {trackInfo.name} by {trackInfo.artist}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userImage && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">User Provided Image</h3>
              <div className="relative aspect-square rounded-md overflow-hidden">
                <img src={userImage} alt="User provided" className="w-full h-full object-cover" />
              </div>
            </CardContent>
          </Card>
        )}

        {spotifyImage && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Spotify Image</h3>
              <div className="relative aspect-square rounded-md overflow-hidden">
                <img src={spotifyImage} alt="Spotify" className="w-full h-full object-cover" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {similarity !== null && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Image Similarity</h3>
            <p className="text-2xl font-bold text-blue-600">
              {similarity.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 