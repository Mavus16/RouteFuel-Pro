import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, DollarSign, Route } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StopCard } from '../components/ui/StopCard';
import { Map } from '../components/ui/Map';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { RouteResponse } from '../lib/types';
import { formatDistance, formatFuelCost } from '../lib/utils';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [routeResult, setRouteResult] = useState<RouteResponse | null>(null);

  useEffect(() => {
    // First try to get data from router state (immediate access)
    if (location.state) {
      setRouteResult(location.state as RouteResponse);
      return;
    }

    // Fallback to localStorage
    const storedResult = localStorage.getItem('routeResult');
    if (storedResult) {
      try {
        setRouteResult(JSON.parse(storedResult));
      } catch (error) {
        console.error('Error parsing stored route result:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate, location.state]);

  if (!routeResult) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading results...</p>
        </div>
      </div>
    );
  }

  const handleNewSearch = () => {
    localStorage.removeItem('routeResult');
    navigate('/');
  };

  // Production: Remove debug logging
  // console.log("DEBUG routeResult:", routeResult);

  return (
    <div className="min-h-screen bg-background-secondary">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Breadcrumbs 
          items={[
            { label: 'Route Results', path: undefined }
          ]} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Route Summary and Stops */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Route className="h-5 w-5 text-accent" />
                  <span>Route Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Route Breadcrumb */}
                <div className="mb-6 p-4 bg-background-secondary rounded-lg">
                  <div className="flex items-center flex-wrap gap-2 text-sm">
                    <span className="font-medium text-accent">
                      {typeof routeResult.origin === "string" 
                        ? routeResult.origin 
                        : routeResult.origin?.address || "Unknown Origin"}
                    </span>
                    {Array.isArray(routeResult.intermediates) && routeResult.intermediates.map((intermediate, index) => (
                      <React.Fragment key={index}>
                        <span className="text-text-secondary">→</span>
                        <span className="font-medium text-text-primary">
                          {typeof intermediate === "string" 
                            ? intermediate 
                            : intermediate?.address || `Intermediate ${index + 1}`}
                        </span>
                      </React.Fragment>
                    ))}
                    <span className="text-text-secondary">→</span>
                    <span className="font-medium text-accent">
                      {typeof routeResult.destination === "string" 
                        ? routeResult.destination 
                        : routeResult.destination?.address || "Unknown Destination"}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-text-secondary">Distance</span>
                    </div>
                    <p className="text-lg font-semibold text-text-primary">
                      {formatDistance(routeResult.distanceMiles || 0)}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Clock className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-text-secondary">Duration</span>
                    </div>
                    <p className="text-lg font-semibold text-text-primary">
                      {routeResult.adjustedDurationHuman || "Unknown"}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <DollarSign className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-text-secondary">Fuel Cost</span>
                    </div>
                    <p className="text-lg font-semibold text-text-primary">
                      {formatFuelCost(routeResult.adjustedFuelCost || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stops Section */}
            <div className="space-y-4">
              <h2 className="text-h2 text-text-primary">Gas Stations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(routeResult.stops) && routeResult.stops.map((stop, index) => (
                  <StopCard key={index} stop={stop} index={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Route Map</CardTitle>
              </CardHeader>
              <CardContent>
                <Map 
                  encodedPolyline={routeResult.encodedPolyline || ""}
                  stops={routeResult.stops || []}
                  origin={routeResult.origin || null}
                  destination={routeResult.destination || null}
                  intermediates={Array.isArray(routeResult.intermediates) ? routeResult.intermediates : []}
                  className="h-96"
                />
              </CardContent>
            </Card>

            <Button
              onClick={handleNewSearch}
              variant="secondary"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              🔄 Start a New Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
