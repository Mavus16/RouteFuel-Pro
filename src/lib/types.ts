export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface RouteRequest {
  origin: Location;
  destination: Location;
  intermediates: Location[];
  fuelType: 'diesel' | 'petrol';
  weight: number;
}

export interface Stop {
  name: string;
  address: string;
  rating: number;
  totalRatings: number;
  priceLevel: number;
  lat: number;
  lng: number;
}

export interface RouteResponse {
  origin: Location;
  destination: Location;
  intermediates: Location[];
  distanceMiles: number;
  adjustedDurationHuman: string;
  adjustedFuelCost: number;
  encodedPolyline: string;
  stops: Stop[];
}

export interface PlaceResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export const fuelTypes = [
  { value: 'diesel', label: 'Diesel' },
  { value: 'petrol', label: 'Petrol' }
];

export const weightRanges = [
  { value: 10000, label: '10,000 lbs' },
  { value: 20000, label: '20,000 lbs' },
  { value: 30000, label: '30,000 lbs' },
  { value: 40000, label: '40,000 lbs' },
  { value: 50000, label: '50,000 lbs' },
  { value: 60000, label: '60,000 lbs' },
  { value: 70000, label: '70,000 lbs' },
  { value: 80000, label: '80,000 lbs' }
];

// Google Maps type definitions
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (mapDiv: HTMLElement, opts?: any) => any;
        Polyline: new (opts?: any) => any;
        Marker: new (opts?: any) => any;
        InfoWindow: new (opts?: any) => any;
        LatLng: new (lat: number, lng: number) => any;
        LatLngBounds: new () => any;
        Size: new (width: number, height: number) => any;
        MapTypeId: {
          ROADMAP: any;
        };
        SymbolPath: {
          CIRCLE: any;
        };
        places: {
          Autocomplete: new (input: HTMLInputElement, opts?: any) => any;
        };
        event: {
          clearInstanceListeners: (autocomplete: any) => void;
        };
      };
    };
    googleMapsLoaded?: boolean;
  }
}
