// Google Maps Places API Types
export interface GoogleMapsPlacePrediction {
  mainText?: { text: string };
  secondaryText?: { text: string };
  toPlace: () => Promise<GoogleMapsPlace>;
}

export interface GoogleMapsPlace {
  displayName?: string;
  formattedAddress?: string;
  location?: {
    lat: () => number;
    lng: () => number;
  };
  fetchFields: (options: { fields: string[] }) => Promise<void>;
}

export interface GoogleMapsAutocompleteSuggestion {
  placePrediction: GoogleMapsPlacePrediction;
}

export interface GoogleMapsPlacesLibrary {
  AutocompleteSessionToken: new () => GoogleMapsSessionToken;
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions: (options: {
      input: string;
      sessionToken: GoogleMapsSessionToken;
    }) => Promise<{ suggestions: GoogleMapsAutocompleteSuggestion[] }>;
  };
}

export interface GoogleMapsSessionToken {
  // Session token instance
}

declare global {
  interface Window {
    google?: {
      maps: {
        importLibrary: (library: string) => Promise<GoogleMapsPlacesLibrary>;
      };
    };
  }
}

export {};
