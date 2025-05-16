import { ImageComparison } from "@/components/image-comparison"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="max-w-3xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Spotify Image Comparison</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Compare your album art with Spotify's version
          </p>
        </div>

        <ImageComparison />
      </div>
    </main>
  )
}
