"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentLocation, getAreaFromCoordinates } from "@/lib/getNearbyData";

interface LocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
  onCoordinatesChange?: (lat: number, lng: number) => void;
}

const LOCATIONS = [
  { value: 'central-pattaya', label: 'Central Pattaya', icon: '🏙️' },
  { value: 'beach-road', label: 'Beach Road', icon: '🏖️' },
  { value: 'walking-street', label: 'Walking Street', icon: '🌃' },
  { value: 'jomtien', label: 'Jomtien', icon: '🌊' },
  { value: 'naklua', label: 'Naklua', icon: '🐟' },
  { value: 'pratumnak', label: 'Pratumnak', icon: '⛰️' },
  { value: 'north-pattaya', label: 'North Pattaya', icon: '🌴' },
  { value: 'south-pattaya', label: 'South Pattaya', icon: '🌅' },
];

export default function LocationSelector({
  value,
  onChange,
  onCoordinatesChange,
}: LocationSelectorProps) {
  const [detecting, setDetecting] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  useEffect(() => {
    // Load saved location from localStorage
    const saved = localStorage.getItem('pattaya-directory-location');
    if (saved) {
      onChange(saved);
    }
  }, []);

  const handleLocationChange = (newLocation: string) => {
    onChange(newLocation);
    localStorage.setItem('pattaya-directory-location', newLocation);
    setUseCurrentLocation(false);
  };

  const detectLocation = async () => {
    setDetecting(true);
    try {
      const coords = await getCurrentLocation();
      
      if (coords.latitude && coords.longitude) {
        const area = getAreaFromCoordinates(coords.latitude, coords.longitude);
        onChange(area);
        localStorage.setItem('pattaya-directory-location', area);
        setUseCurrentLocation(true);
        
        if (onCoordinatesChange) {
          onCoordinatesChange(coords.latitude, coords.longitude);
        }
      }
    } catch (error) {
      console.error('Failed to detect location:', error);
      // Fallback to Central Pattaya
      onChange('central-pattaya');
    } finally {
      setDetecting(false);
    }
  };

  const selectedLocation = LOCATIONS.find(loc => loc.value === value);

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="w-4 h-4" />
        <span className="font-medium">Your Location:</span>
      </div>

      <div className="flex flex-wrap gap-2 flex-1">
        <Select value={value} onValueChange={handleLocationChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue>
              {selectedLocation && (
                <span className="flex items-center gap-2">
                  <span>{selectedLocation.icon}</span>
                  <span>{selectedLocation.label}</span>
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {LOCATIONS.map((location) => (
              <SelectItem key={location.value} value={location.value}>
                <span className="flex items-center gap-2">
                  <span>{location.icon}</span>
                  <span>{location.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={detectLocation}
          disabled={detecting}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {detecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          {detecting ? 'Detecting...' : 'Use My Location'}
        </Button>

        {useCurrentLocation && (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <Navigation className="w-3 h-3" />
            Using Current Location
          </Badge>
        )}
      </div>
    </div>
  );
}