import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Stop } from '../../lib/types';

interface StopCardProps {
  stop: Stop;
  index: number;
}

export const StopCard: React.FC<StopCardProps> = ({ stop, index }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderPriceLevel = (level: number) => {
    return '$'.repeat(level);
  };

  return (
    <Card className="hover:shadow-elevation3 transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-text-inverse text-sm font-medium">
              {index + 1}
            </div>
            <CardTitle className="text-base">{stop.name}</CardTitle>
          </div>
          <span className="text-sm font-medium text-text-secondary">
            {renderPriceLevel(stop.priceLevel)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 text-text-secondary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-text-secondary leading-relaxed">
            {stop.address}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {renderStars(stop.rating)}
            <span className="text-sm text-text-secondary ml-1">
              {stop.rating.toFixed(1)}
            </span>
            <span className="text-sm text-text-secondary">
              ({stop.totalRatings} reviews)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
