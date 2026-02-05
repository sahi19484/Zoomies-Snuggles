import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface ImageOptimizationPayload {
  imageUrl?: string;
  base64Image?: string;
  fileName: string;
  petId: string;
  imageType: 'profile' | 'gallery' | 'thumbnail';
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

console.info('Image optimization service started');

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: { 'Access-Control-Allow-Origin': '*' } 
    });
  }

  try {
    const payload: ImageOptimizationPayload = await req.json();
    const {
      imageUrl,
      base64Image,
      fileName,
      petId,
      imageType,
      maxWidth = imageType === 'thumbnail' ? 200 : 800,
      maxHeight = imageType === 'thumbnail' ? 200 : 800,
      quality = 80
    } = payload;

    // Validate input
    if (!fileName || !petId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'fileName and petId are required'
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Generate optimized image paths
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const basePath = `pets/${petId}/${imageType}`;
    const optimizedPath = `${basePath}/${timestamp}-${sanitizedFileName}`;
    const webpPath = `${basePath}/${timestamp}-${sanitizedFileName.replace(/\.[^.]+$/, '.webp')}`;

    console.info(`Processing image:`, {
      fileName,
      petId,
      imageType,
      dimensions: { maxWidth, maxHeight },
      quality
    });

    // Image optimization specs based on type
    const imageSpecs = {
      profile: {
        width: 400,
        height: 400,
        quality: 85,
        format: 'webp',
        description: 'Profile picture for pet listing'
      },
      gallery: {
        width: 800,
        height: 600,
        quality: 80,
        format: 'webp',
        description: 'Gallery image for pet details'
      },
      thumbnail: {
        width: 200,
        height: 200,
        quality: 75,
        format: 'webp',
        description: 'Thumbnail for pet cards'
      }
    };

    const specs = imageSpecs[imageType];

    // Mock response (in production, you would use a library like Sharp or ImageMagick)
    // Example with Sharp:
    // const sharp = require('sharp');
    // const buffer = await sharp(imageUrl || base64Image)
    //   .resize(specs.width, specs.height, { fit: 'cover' })
    //   .webp({ quality: specs.quality })
    //   .toBuffer();

    const optimizedImage = {
      original: {
        fileName,
        path: `https://storage.googleapis.com/${Deno.env.get('BUCKET_NAME')}/${optimizedPath}`,
        size: 'original',
        format: 'jpg'
      },
      optimized: {
        fileName: `${timestamp}-${sanitizedFileName.replace(/\.[^.]+$/, '.webp')}`,
        path: `https://storage.googleapis.com/${Deno.env.get('BUCKET_NAME')}/${webpPath}`,
        size: `${specs.width}x${specs.height}`,
        format: 'webp',
        quality: specs.quality
      },
      metadata: {
        petId,
        imageType,
        uploadedAt: new Date().toISOString(),
        dimensions: {
          width: specs.width,
          height: specs.height
        }
      }
    };

    console.info(`Image optimized:`, optimizedImage);

    // TODO: Integration steps:
    // 1. Use a service like Cloudinary, Imgix, or Firebase Storage
    // 2. Upload original and optimized versions
    // 3. Return URLs for both versions
    // 4. Update pet record in database with image URL

    return new Response(
      JSON.stringify({
        success: true,
        message: `Image optimized successfully`,
        data: optimizedImage,
        timestamp: new Date().toISOString()
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        status: 200
      }
    );

  } catch (error) {
    console.error('Image optimization error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Image optimization failed'
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

// Image optimization recommendations
export const IMAGE_RECOMMENDATIONS = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  minDimensions: { width: 100, height: 100 },
  maxDimensions: { width: 4000, height: 4000 },
  optimizationLevels: {
    thumbnail: { width: 200, height: 200, quality: 75 },
    medium: { width: 500, height: 500, quality: 80 },
    large: { width: 1000, height: 1000, quality: 85 },
    original: { width: 2000, height: 2000, quality: 90 }
  }
};

// Helper function to validate image
export function validateImage(fileName: string, fileSize: number): { valid: boolean; error?: string } {
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (!extension || !IMAGE_RECOMMENDATIONS.allowedFormats.includes(extension)) {
    return {
      valid: false,
      error: `Invalid format. Allowed: ${IMAGE_RECOMMENDATIONS.allowedFormats.join(', ')}`
    };
  }

  if (fileSize > IMAGE_RECOMMENDATIONS.maxFileSize) {
    return {
      valid: false,
      error: `File too large. Max: ${IMAGE_RECOMMENDATIONS.maxFileSize / 1024 / 1024}MB`
    };
  }

  return { valid: true };
}
