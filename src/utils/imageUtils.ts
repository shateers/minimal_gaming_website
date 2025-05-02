
/**
 * Image utility functions for handling fallbacks and errors
 */

// Default fallback image that will be used if an image fails to load
export const DEFAULT_FALLBACK_IMAGE = "/placeholder.svg";

/**
 * Sets a fallback image when the original image fails to load
 * @param e The error event from the image
 * @param fallbackImage Optional custom fallback image path
 * @returns void
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackImage: string = DEFAULT_FALLBACK_IMAGE
): void => {
  const target = e.target as HTMLImageElement;
  console.log(`Image load error for: ${target.alt || 'unknown image'}`);
  target.src = fallbackImage;
};
