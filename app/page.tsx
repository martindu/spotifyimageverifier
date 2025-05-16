import { SpotifyArtFetcher } from "@/components/spotify-art-fetcher"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="max-w-3xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Spotify Album Art Fetcher</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Input base64-encoded Spotify identifiers to fetch album or track artwork
          </p>
        </div>

        <SpotifyArtFetcher />
      </div>
    </main>
  )
}
