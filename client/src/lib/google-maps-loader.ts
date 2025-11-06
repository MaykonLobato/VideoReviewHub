// Global Google Maps loader for new Places API
let isLoading = false;
let isLoaded = false;
const callbacks: (() => void)[] = [];

export function loadGoogleMaps(callback: () => void): void {
  // Already loaded
  if (isLoaded && window.google?.maps) {
    callback();
    return;
  }

  // Add to queue
  callbacks.push(callback);

  // Already loading
  if (isLoading) {
    return;
  }

  // Check if script already exists
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
  if (existingScript) {
    // Wait for importLibrary to be ready
    const checkImportLibrary = () => {
      if (window.google?.maps && typeof window.google.maps.importLibrary === 'function') {
        isLoaded = true;
        callbacks.forEach(cb => cb());
        callbacks.length = 0;
      } else {
        setTimeout(checkImportLibrary, 100);
      }
    };
    checkImportLibrary();
    return;
  }

  // Start loading
  isLoading = true;

  const script = document.createElement('script');
  // Load with loading=async but WITHOUT libraries parameter - we'll use importLibrary
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&loading=async`;
  script.async = true;
  script.defer = true;

  script.onload = () => {
    // Wait for importLibrary to be available
    const checkImportLibrary = () => {
      if (window.google?.maps && typeof window.google.maps.importLibrary === 'function') {
        isLoaded = true;
        isLoading = false;
        callbacks.forEach(cb => cb());
        callbacks.length = 0;
      } else {
        setTimeout(checkImportLibrary, 50);
      }
    };
    checkImportLibrary();
  };

  script.onerror = () => {
    isLoading = false;
    console.error('[GoogleMaps] Failed to load Google Maps script');
  };

  document.head.appendChild(script);
}
