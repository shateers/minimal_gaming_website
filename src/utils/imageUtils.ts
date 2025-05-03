
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
  
  // Check if the error is related to an ad blocker
  if (target.src.includes('upload') || target.src.includes('track') || target.src.includes('analytics')) {
    console.info('Image might be blocked by an ad blocker. Using fallback image.');
  }
  
  target.src = fallbackImage;
  
  // Remove onerror to prevent infinite loops if fallback also fails
  target.onerror = null;
};

/**
 * Checks if an image URL is likely to be blocked by ad blockers
 * @param url The image URL to check
 * @returns boolean indicating if the URL might be blocked
 */
export const isPotentiallyBlockedUrl = (url: string): boolean => {
  const sensitiveTerms = [
    'upload', 'ad', 'track', 'analytics', 'pixel', 'banner',
    'sponsor', 'marketing', 'promotion', 'campaign'
  ];
  
  const lowerUrl = url.toLowerCase();
  return sensitiveTerms.some(term => lowerUrl.includes(term));
};

/**
 * Gets a safe image URL that is less likely to be blocked by ad blockers
 * @param originalUrl The original image URL
 * @param fallbackUrl The fallback URL to use if original might be blocked
 * @returns A URL less likely to be blocked by ad blockers
 */
export const getSafeImageUrl = (
  originalUrl: string | undefined, 
  fallbackUrl: string = DEFAULT_FALLBACK_IMAGE
): string => {
  if (!originalUrl) {
    return fallbackUrl;
  }
  
  if (isPotentiallyBlockedUrl(originalUrl)) {
    // For development purposes, log which URLs might be problematic
    console.info(`URL might be blocked by ad blockers: ${originalUrl}`);
    
    // If we have a renamed path version, use that
    if (originalUrl.includes('lovable-uploads')) {
      return originalUrl.replace('lovable-uploads', 'assets/images');
    }
  }
  
  return originalUrl;
};
