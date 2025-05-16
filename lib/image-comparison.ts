import { createHash } from "crypto"

// Function to load an image and get its pixel data
async function loadImageData(imageUrl: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      // Resize image to 32x32 for consistent comparison
      canvas.width = 32
      canvas.height = 32
      ctx.drawImage(img, 0, 0, 32, 32)
      
      const imageData = ctx.getImageData(0, 0, 32, 32)
      resolve(imageData)
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = imageUrl
  })
}

// Function to calculate perceptual hash of an image
function calculatePerceptualHash(imageData: ImageData): string {
  const pixels = imageData.data
  let hash = ""

  // Convert to grayscale and calculate average
  let sum = 0
  for (let i = 0; i < pixels.length; i += 4) {
    const gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3
    sum += gray
  }
  const average = sum / (pixels.length / 4)

  // Create hash based on whether each pixel is above or below average
  for (let i = 0; i < pixels.length; i += 4) {
    const gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3
    hash += gray > average ? "1" : "0"
  }

  return hash
}

// Function to calculate similarity between two hashes
function calculateHashSimilarity(hash1: string, hash2: string): number {
  let differences = 0
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      differences++
    }
  }
  return 100 - (differences / hash1.length) * 100
}

// Main function to calculate similarity between two images
export async function calculateImageSimilarity(image1Url: string, image2Url: string): Promise<number> {
  try {
    // Load both images
    const [image1Data, image2Data] = await Promise.all([
      loadImageData(image1Url),
      loadImageData(image2Url)
    ])

    // Calculate perceptual hashes
    const hash1 = calculatePerceptualHash(image1Data)
    const hash2 = calculatePerceptualHash(image2Data)

    // Calculate similarity
    return calculateHashSimilarity(hash1, hash2)
  } catch (error) {
    console.error("Error calculating image similarity:", error)
    throw new Error("Failed to calculate image similarity")
  }
} 