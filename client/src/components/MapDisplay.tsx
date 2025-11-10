import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import type { Location } from '@/types/video';
import { loadGoogleMaps } from '@/lib/google-maps-loader';

interface MapDisplayProps {
  location: Location;
}

export default function MapDisplay({ location }: MapDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    loadGoogleMaps(() => {
      initMap();
    });
  }, [location]);

  const initMap = () => {
    if (!mapRef.current || !window.google?.maps) {
      return;
    }

    try {
      // Clean up previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: location.lat, lng: location.lng },
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }],
          },
        ],
      });

      new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
      });

      mapInstanceRef.current = map;
      setMapLoaded(true);
    } catch (error) {
      console.error('[MapDisplay] Error initializing map:', error);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <div>
          <p className="font-medium text-sm" data-testid="text-location-name">
            {location.name}
          </p>
          <p className="text-xs text-muted-foreground" data-testid="text-location-address">
            {location.address}
          </p>
        </div>
      </div>
      <div
        ref={mapRef}
        className="w-full h-64 relative"
        data-testid="map-container"
        style={{ minHeight: '256px' }}
      >
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <p className="text-muted-foreground">Carregando mapa...</p>
          </div>
        )}
      </div>
    </Card>
  );
}
