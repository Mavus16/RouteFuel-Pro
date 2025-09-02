import React, { useEffect, useRef } from 'react';
import polyline from '@mapbox/polyline';
import { Stop } from '../../lib/types';

// Define the Location interface for the new backend format
interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface MapProps {
  encodedPolyline: string;
  stops: Stop[];
  origin: Location | string | null;
  destination: Location | string | null;
  intermediates: (Location | string)[];
  className?: string;
}

export const Map: React.FC<MapProps> = ({ 
  encodedPolyline, 
  stops, 
  origin, 
  destination, 
  intermediates, 
  className 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Helper function to get coordinates from location (with fallback)
  const getLocationCoords = (location: Location | string | null): { lat: number; lng: number } | null => {
    if (!location) return null;
    if (typeof location === 'string') {
      // Fallback for string locations (backward compatibility)
      return null;
    }
    if (location && typeof location === 'object' && typeof location.lat === 'number' && typeof location.lng === 'number') {
      return { lat: location.lat, lng: location.lng };
    }
    return null;
  };

  // Helper function to get address from location
  const getLocationAddress = (location: Location | string | null): string => {
    if (!location) return "Unknown Location";
    if (typeof location === 'string') {
      return location;
    }
    if (location && typeof location === 'object' && location.address) {
      return location.address;
    }
    return "Unknown Location";
  };

  // Helper function to check if location has valid coordinates
  const hasValidCoords = (location: Location | string | null): boolean => {
    const coords = getLocationCoords(location);
    return coords !== null;
  };

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 8,
      center: { lat: 39.8283, lng: -98.5795 }, // Center of US
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;

    return () => {
      // Cleanup will be handled in the polyline effect
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !encodedPolyline) return;

    // Clear existing polyline and markers
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    try {
      // Decode the polyline using @mapbox/polyline
      const pathCoords = polyline.decode(encodedPolyline).map(([lat, lng]) => ({ lat, lng }));
      
      if (pathCoords.length > 0) {
        const polyline = new window.google.maps.Polyline({
          path: pathCoords,
          geodesic: true,
          strokeColor: '#4285F4',
          strokeOpacity: 0.8,
          strokeWeight: 4,
          map: mapInstanceRef.current
        });

        polylineRef.current = polyline;

        // Fit bounds to show the entire route
        const bounds = new window.google.maps.LatLngBounds();
        pathCoords.forEach(point => bounds.extend(point));
        mapInstanceRef.current.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error decoding polyline:', error);
    }
  }, [encodedPolyline]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const markers: any[] = [];
    const bounds = new window.google.maps.LatLngBounds();

    // Add origin marker (green) - using actual coordinates if available
    if (origin && hasValidCoords(origin)) {
      const originCoords = getLocationCoords(origin);
      if (originCoords) {
        try {
          const originMarker = new window.google.maps.Marker({
            position: originCoords,
            map: mapInstanceRef.current,
            title: `Origin: ${getLocationAddress(origin)}`,
            label: {
              text: 'O',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#10B981', // Green
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2
            }
          });
          markers.push(originMarker);
          bounds.extend(originCoords);
        } catch (error) {
          console.error('Error creating origin marker:', error);
        }
      }
    }

    // Add destination marker (red) - using actual coordinates if available
    if (destination && hasValidCoords(destination)) {
      const destCoords = getLocationCoords(destination);
      if (destCoords) {
        try {
          const destMarker = new window.google.maps.Marker({
            position: destCoords,
            map: mapInstanceRef.current,
            title: `Destination: ${getLocationAddress(destination)}`,
            label: {
              text: 'D',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#EF4444', // Red
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2
            }
          });
          markers.push(destMarker);
          bounds.extend(destCoords);
        } catch (error) {
          console.error('Error creating destination marker:', error);
        }
      }
    }

    // Add intermediate markers (blue) - using actual coordinates if available
    if (Array.isArray(intermediates)) {
      intermediates.forEach((intermediate, index) => {
        if (hasValidCoords(intermediate)) {
          const intermediateCoords = getLocationCoords(intermediate);
          if (intermediateCoords) {
            try {
              const intermediateMarker = new window.google.maps.Marker({
                position: intermediateCoords,
                map: mapInstanceRef.current,
                title: `Intermediate: ${getLocationAddress(intermediate)}`,
                label: {
                  text: `${index + 1}`,
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                },
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: '#3B82F6', // Blue
                  fillOpacity: 1,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 2
                }
              });
              markers.push(intermediateMarker);
              bounds.extend(intermediateCoords);
            } catch (error) {
              console.error(`Error creating intermediate marker ${index + 1}:`, error);
            }
          }
        }
      });
    }

    // Add gas station markers (gas pump icon) using actual lat/lng from stops
    if (Array.isArray(stops)) {
      stops.forEach((stop, index) => {
        if (stop && typeof stop.lat === 'number' && typeof stop.lng === 'number') {
          try {
            const marker = new window.google.maps.Marker({
              position: { lat: stop.lat, lng: stop.lng },
              map: mapInstanceRef.current,
              title: stop.name || 'Gas Station',
              label: {
                text: `⛽`, // Gas pump emoji
                color: 'black',
                fontSize: '16px',
                fontWeight: 'bold'
              },
              icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/gas.png',
                scaledSize: new window.google.maps.Size(32, 32)
              }
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; max-width: 200px;">
                  <h3 style="margin: 0 0 4px 0; font-weight: 600;">${stop.name || 'Gas Station'}</h3>
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${stop.address || 'Address not available'}</p>
                  <p style="margin: 0; font-size: 12px;">
                    Rating: ${stop.rating || 'N/A'}/5 | Price: ${'$'.repeat(stop.priceLevel || 1)}
                  </p>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstanceRef.current, marker);
            });

            markers.push(marker);
            bounds.extend({ lat: stop.lat, lng: stop.lng });
          } catch (error) {
            console.error(`Error creating gas station marker ${index}:`, error);
          }
        }
      });
    }

    markersRef.current = markers;

    // Fit bounds to include all markers
    if (!bounds.isEmpty()) {
      mapInstanceRef.current.fitBounds(bounds);
    }

    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [stops, origin, destination, intermediates]);

  return (
    <div 
      ref={mapRef} 
      className={className || "w-full h-96 rounded-lg border border-border-light"}
    />
  );
};
