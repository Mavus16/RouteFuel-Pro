import React, { useEffect, useRef, useCallback, useState } from 'react';
import { cn } from '../../lib/utils';

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  onPlaceSelected?: (location: { address: string; lat: number; lng: number }) => void;
}

export const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  label,
  error,
  onKeyPress,
  onPlaceSelected
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Check if Google Maps API is loaded
  useEffect(() => {
    const checkGoogleLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        // Production: Remove debug logging
        // console.log('Google Maps API loaded successfully');
        setIsGoogleLoaded(true);
      } else if (window.googleMapsLoaded) {
        // Use the callback flag if available
        // Production: Remove debug logging
        // console.log('Google Maps API loaded via callback');
        setIsGoogleLoaded(true);
      } else {
        // Retry after a short delay
        setTimeout(checkGoogleLoaded, 100);
      }
    };
    
    checkGoogleLoaded();
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!inputRef.current || !isGoogleLoaded) {
      return;
    }

          try {
        // Production: Remove debug logging
        // console.log('Initializing Google Places Autocomplete');
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)'],
        fields: ['place_id', 'formatted_address', 'geometry'],
      });

              autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address && place.geometry?.location) {
            // Production: Remove debug logging
            // console.log('Place selected:', place.formatted_address);
            // console.log('Coordinates:', place.geometry.location.lat(), place.geometry.location.lng());
            
            // Call onPlaceSelected with full location data
            if (onPlaceSelected) {
              onPlaceSelected({
                address: place.formatted_address,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              });
            }
            
            // Also call onChange to update the input value
            onChange(place.formatted_address);
          }
        });

              autocompleteRef.current = autocomplete;
        // Production: Remove debug logging
        // console.log('Google Places Autocomplete initialized successfully');

      return () => {
        if (autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    } catch (err) {
      console.error('Error initializing Google Places Autocomplete:', err);
    }
  }, [isGoogleLoaded, onChange, onPlaceSelected]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent form submission on Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onKeyPress) {
        onKeyPress(e);
      }
    }
  }, [onKeyPress]);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "flex h-12 w-full rounded-md border border-border-medium bg-background-primary px-4 py-3 text-base text-text-primary placeholder:text-text-placeholder focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-10",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-10"
        )}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {!isGoogleLoaded && (
        <p className="text-xs text-text-secondary">Loading Google Places...</p>
      )}
    </div>
  );
};