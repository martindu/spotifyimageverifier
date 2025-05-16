"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { fetchSpotifyArt } from "@/lib/spotify"
import { Loader2, Music, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SpotifyArtFetcher() {
  const [base64Input, setBase64Input] = useState("")
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!base64Input.trim()) {
      setError("Please enter a base64 string")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchSpotifyArt(base64Input)
      setArtworkUrl(result.imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch artwork")
      setArtworkUrl(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="base64-input" className="text-sm font-medium">
            Base64 Input
          </label>
          <Textarea
            id="base64-input"
            placeholder="Paste your base64-encoded Spotify identifier here..."
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            className="min-h-[120px] font-mono text-sm"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || !base64Input.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fetching Artwork...
            </>
          ) : (
            <>Fetch Artwork</>
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

      {artworkUrl && (
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Album Artwork</h2>
            <div className="relative w-64 h-64 rounded-md overflow-hidden shadow-lg">
              <img src={artworkUrl || "/placeholder.svg"} alt="Album artwork" className="w-full h-full object-cover" />
            </div>
            <a
              href={artworkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            >
              Open image in new tab
            </a>
          </CardContent>
        </Card>
      )}

      {!artworkUrl && !error && !isLoading && (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg border-zinc-300 dark:border-zinc-700">
          <Music className="h-12 w-12 text-zinc-400 mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400 text-center">Enter a base64 string to fetch album artwork</p>
        </div>
      )}

      <div className="text-sm text-zinc-500 dark:text-zinc-400 space-y-2 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-md">
        <h3 className="font-medium">How to use:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Paste a base64-encoded Spotify identifier in the text area</li>
          <li>Click "Fetch Artwork" to retrieve the album or track image</li>
          <li>The artwork will display below when successfully fetched</li>
        </ol>
      </div>
    </div>
  )
}
