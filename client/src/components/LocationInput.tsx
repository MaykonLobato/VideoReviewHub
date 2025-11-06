import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, X } from 'lucide-react';
import type { Location } from '@/types/video';
import { loadGoogleMaps } from '@/lib/google-maps-loader';
import type {
  GoogleMapsPlacesLibrary,
  GoogleMapsSessionToken,
  GoogleMapsAutocompleteSuggestion
} from '@/types/google-maps';

interface LocationInputProps {
  value: Location | null;
  onChange: (location: Location | null) => void;
}

export default function LocationInput({ value, onChange }: LocationInputProps) {
  const [inputValue, setInputValue] = useState(value?.name || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState<GoogleMapsAutocompleteSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Cache the imported Places library and session token
  const placesLibRef = useRef<GoogleMapsPlacesLibrary | null>(null);
  const sessionTokenRef = useRef<GoogleMapsSessionToken | null>(null);

  useEffect(() => {
    loadGoogleMaps(async () => {
      try {
        // Import and cache the Places library
        // @ts-ignore - importLibrary is available after loading
        placesLibRef.current = await google.maps.importLibrary('places');

        // Create and cache session token
        const { AutocompleteSessionToken } = placesLibRef.current;
        sessionTokenRef.current = new AutocompleteSessionToken();

        setIsLoaded(true);
        console.log('[LocationInput] Google Maps Places library loaded successfully');
      } catch (error) {
        console.error('[LocationInput] Failed to load Google Maps Places library:', error);
      }
    });
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Clear location if user manually changes the input
    if (value && newValue !== value.name) {
      onChange(null);
    }

    // Get suggestions using new API
    if (newValue.trim().length >= 3 && isLoaded && placesLibRef.current) {
      try {
        const { AutocompleteSuggestion } = placesLibRef.current;

        const { suggestions: fetchedSuggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: newValue,
          sessionToken: sessionTokenRef.current,
        });

        setSuggestions(fetchedSuggestions || []);
        setShowSuggestions((fetchedSuggestions || []).length > 0);
      } catch (error) {
        console.error('[LocationInput] Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = async (suggestion: GoogleMapsAutocompleteSuggestion) => {
    if (!placesLibRef.current) return;

    try {
      const placePrediction = suggestion.placePrediction;

      // Fetch full place details
      const place = await placePrediction.toPlace();
      await place.fetchFields({
        fields: ['location', 'formattedAddress', 'displayName'],
      });

      const location: Location = {
        name: place.displayName || placePrediction.mainText?.text || '',
        address: place.formattedAddress || '',
        lat: place.location?.lat() || 0,
        lng: place.location?.lng() || 0,
      };

      setInputValue(location.name);
      onChange(location);
      setShowSuggestions(false);
      setSuggestions([]);

      // Reset session token after selection for billing optimization
      const { AutocompleteSessionToken } = placesLibRef.current;
      sessionTokenRef.current = new AutocompleteSessionToken();
      console.log('[LocationInput] Location selected, session token reset');
    } catch (error) {
      console.error('[LocationInput] Error selecting suggestion:', error);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div>
      <Label htmlFor="location">Localização (Opcional)</Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          id="location"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={isLoaded ? "Digite o nome ou endereço do local..." : "Carregando..."}
          className="pl-10 pr-10"
          data-testid="input-location"
          disabled={!isLoaded}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent z-10"
            onClick={handleClear}
            data-testid="button-clear-location"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => {
              const placePrediction = suggestion.placePrediction;
              const mainText = placePrediction.mainText?.text || '';
              const secondaryText = placePrediction.secondaryText?.text || '';

              return (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-accent cursor-pointer border-b last:border-b-0 flex items-start gap-2"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {mainText}
                    </p>
                    {secondaryText && (
                      <p className="text-xs text-muted-foreground truncate">
                        {secondaryText}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      {value && (
        <p className="text-sm text-muted-foreground mt-1" data-testid="text-location-address">
          {value.address}
        </p>
      )}
      {!isLoaded && (
        <p className="text-xs text-muted-foreground mt-1">
          Carregando Google Maps...
        </p>
      )}
    </div>
  );
}
