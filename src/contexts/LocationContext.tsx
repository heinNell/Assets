// src/contexts/LocationContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as Location from "expo-location";
import { LocationData } from "../types";

interface LocationContextType {
  currentLocation: LocationData | null;
  locationPermission: boolean;
  isTracking: boolean;
  startLocationTracking: () => Promise<void>;
  stopLocationTracking: () => Promise<void>;
  requestLocationPermission: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
}) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [locationPermission, setLocationPermission] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const hasPermission = status === "granted";
      setLocationPermission(hasPermission);
      return hasPermission;
    } catch (error) {
      console.error("Error requesting location permission:", error);
      return false;
    }
  };

  const startLocationTracking = async (): Promise<void> => {
    if (!locationPermission) {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;
    }

    try {
      setIsTracking(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude || null,
        accuracy: location.coords.accuracy || null,
        heading: location.coords.heading || null,
        speed: location.coords.speed || null,
        timestamp: new Date(location.timestamp),
      };

      setCurrentLocation(locationData);
    } catch (error) {
      console.error("Error starting location tracking:", error);
      setIsTracking(false);
    }
  };

  const stopLocationTracking = async (): Promise<void> => {
    setIsTracking(false);
  };

  const value: LocationContextType = {
    currentLocation,
    locationPermission,
    isTracking,
    startLocationTracking,
    stopLocationTracking,
    requestLocationPermission,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
