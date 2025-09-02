import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PlacesAutocomplete } from '../components/ui/PlacesAutocomplete';
import { Combobox } from '../components/ui/Combobox';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { fuelTypes, weightRanges, RouteRequest, RouteResponse, Location } from '../lib/types';
import { calculateRoute } from '../lib/api';

export const InputPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<RouteRequest>({
    origin: { address: '', lat: 0, lng: 0 },
    destination: { address: '', lat: 0, lng: 0 },
    intermediates: [],
    fuelType: 'diesel',
    weight: 80000
  });

  const [intermediateInput, setIntermediateInput] = useState('');

  // Simple handlers
  const handleOriginChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, origin: { ...prev.origin, address: value } }));
  }, []);

  const handleOriginPlaceSelected = useCallback((location: Location) => {
    setFormData(prev => ({ ...prev, origin: location }));
  }, []);

  const handleDestinationChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, destination: { ...prev.destination, address: value } }));
  }, []);

  const handleDestinationPlaceSelected = useCallback((location: Location) => {
    setFormData(prev => ({ ...prev, destination: location }));
  }, []);

  const handleIntermediateInputChange = useCallback((value: string) => {
    setIntermediateInput(value);
  }, []);

  const handleIntermediatePlaceSelected = useCallback((location: Location) => {
    // This is called when a place is selected from Google Places autocomplete
    if (location.address && !formData.intermediates.some(i => i.address === location.address)) {
      setFormData(prev => ({
        ...prev,
        intermediates: [...prev.intermediates, location]
      }));
      setIntermediateInput(''); // Clear the input after adding
    }
  }, [formData.intermediates]);

  const handleFuelTypeChange = useCallback((value: string | number) => {
    setFormData(prev => ({ ...prev, fuelType: value as 'diesel' | 'petrol' }));
  }, []);

  const handleWeightChange = useCallback((value: string | number) => {
    setFormData(prev => ({ ...prev, weight: value as number }));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.origin.address.trim()) {
      newErrors.origin = 'Origin is required';
    }

    if (!formData.destination.address.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (formData.origin.address && formData.destination.address && 
        formData.origin.address.trim() === formData.destination.address.trim()) {
      newErrors.destination = 'Destination must be different from origin';
    }

    // Validate that coordinates are present
    if (formData.origin.lat === 0 && formData.origin.lng === 0) {
      newErrors.origin = 'Please select a valid origin from the dropdown';
    }

    if (formData.destination.lat === 0 && formData.destination.lng === 0) {
      newErrors.destination = 'Please select a valid destination from the dropdown';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    
    // Production: Remove debug logging
    // console.log('Form submission - formData:', formData);
    // console.log('Intermediates array:', formData.intermediates);
    // console.log('Intermediates length:', formData.intermediates.length);
    
    try {
      const response: RouteResponse = await calculateRoute(formData);
      // Store in localStorage as fallback
      localStorage.setItem('routeResult', JSON.stringify(response));
      // Navigate with state for immediate access
      navigate('/results', { state: response });
    } catch (error) {
      console.error('Error calculating route:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate route. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const addIntermediate = useCallback(() => {
    const trimmedInput = intermediateInput.trim();
    if (trimmedInput && !formData.intermediates.some(i => i.address === trimmedInput)) {
      // For manual input, we'll create a placeholder location (this should rarely happen)
      setFormData(prev => ({
        ...prev,
        intermediates: [...prev.intermediates, { address: trimmedInput, lat: 0, lng: 0 }]
      }));
      setIntermediateInput('');
    }
  }, [intermediateInput, formData.intermediates]);

  const removeIntermediate = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      intermediates: prev.intermediates.filter((_, i) => i !== index)
    }));
  }, []);

  const handleIntermediateKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIntermediate();
    }
  }, [addIntermediate]);

  return (
    <div className="min-h-screen bg-background-secondary py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-h1 font-normal text-text-primary mb-4">
            Calculate Your Route
          </h1>
          <p className="text-body text-text-secondary">
            Enter your route details to calculate fuel costs and find gas stations along the way.
          </p>
        </div>

        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-h2">Route Information</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <PlacesAutocomplete
                label="Origin"
                value={formData.origin.address}
                onChange={handleOriginChange}
                onPlaceSelected={handleOriginPlaceSelected}
                placeholder="Enter origin city"
                error={errors.origin}
              />

              <PlacesAutocomplete
                label="Destination"
                value={formData.destination.address}
                onChange={handleDestinationChange}
                onPlaceSelected={handleDestinationPlaceSelected}
                placeholder="Enter destination city"
                error={errors.destination}
              />

              <div className="space-y-3">
                <label className="block text-sm font-medium text-text-primary">
                  Intermediate Stops (Optional)
                </label>
                
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <PlacesAutocomplete
                      value={intermediateInput}
                      onChange={handleIntermediateInputChange}
                      onPlaceSelected={handleIntermediatePlaceSelected}
                      placeholder="Add intermediate city"
                      onKeyPress={handleIntermediateKeyPress}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={addIntermediate}
                    disabled={!intermediateInput.trim()}
                    className="px-3 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.intermediates.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.intermediates.map((city, index) => (
                      <div
                        key={`${city.address}-${index}`}
                        className="flex items-center space-x-2 bg-background-secondary px-3 py-1 rounded-md"
                      >
                        <span className="text-sm text-text-primary">{city.address}</span>
                        <button
                          type="button"
                          onClick={() => removeIntermediate(index)}
                          className="text-text-secondary hover:text-text-primary"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Combobox
                label="Fuel Type"
                options={fuelTypes}
                value={formData.fuelType}
                onValueChange={handleFuelTypeChange}
                placeholder="Select fuel type"
              />

              <Combobox
                label="Weight"
                options={weightRanges}
                value={formData.weight}
                onValueChange={handleWeightChange}
                placeholder="Select weight range"
              />

              {errors.submit && (
                <div className="text-sm text-red-500 text-center">
                  {errors.submit}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !formData.origin.address.trim() || !formData.destination.address.trim()}
              >
                {isLoading ? 'Calculating...' : 'Calculate Route'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};