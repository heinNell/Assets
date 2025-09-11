// src/hooks/useLocationTracking.ts
import { useState, useEffect, useCallback } from "react";
import { LocationTrackingService } from "../services/api/locationTrackingService";
import { LocationApiService } from "../services/api/locationApi";
import { LocationData, TripData } from "../types";

export const useLocationTracking = (driverId?: string) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check permissions and current trip status
  const checkStatus = useCallback(async () => {
    try {
      setLoading(true);

      // Check permissions
      const permissions = await LocationTrackingService.checkPermissions();
      setPermissionsGranted(permissions.foreground);

      // Check active trip
      if (driverId) {
        const status = await LocationTrackingService.getTripStatus(driverId);
        setIsTracking(status.isActive);
        setTripData(status.tripData);
      }

      // Get current location
      const location = await LocationTrackingService.getCurrentLocation();
      setCurrentLocation(location);
    } catch (error) {
      console.error("Error checking status:", error);
    } finally {
      setLoading(false);
    }
  }, [driverId]);

  // Start trip tracking
  const startTrip = useCallback(
    async (vehicleId: string): Promise<string | null> => {
      if (!driverId) return null;

      setLoading(true);
      try {
        const tripId = await LocationTrackingService.startTripTracking(
          driverId,
          vehicleId
        );
        if (tripId) {
          setIsTracking(true);
          await checkStatus(); // Refresh status
          return tripId;
        }
        return null;
      } catch (error) {
        console.error("Error starting trip:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [driverId, checkStatus]
  );

  // Stop trip tracking
  const stopTrip = useCallback(async (): Promise<TripData | null> => {
    setLoading(true);
    try {
      const finalTripData = await LocationTrackingService.stopTripTracking();
      if (finalTripData) {
        setIsTracking(false);
        setTripData(finalTripData);
        return finalTripData;
      }
      return null;
    } catch (error) {
      console.error("Error stopping trip:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Request permissions
  const requestPermissions = useCallback(async () => {
    const granted = await LocationTrackingService.requestPermissions();
    setPermissionsGranted(granted);
    return granted;
  }, []);

  // Force location update
  const forceLocationUpdate = useCallback(async () => {
    await LocationTrackingService.forceLocationUpdate();
    await checkStatus();
  }, [checkStatus]);

  // Subscribe to location updates
  useEffect(() => {
    if (driverId && isTracking) {
      const unsubscribe = LocationApiService.subscribeToDriverLocation(
        driverId,
        (location) => {
          setCurrentLocation(location);
        }
      );

      return unsubscribe;
    }
    return () => {}; // Return empty cleanup function
  }, [driverId, isTracking]);

  // Subscribe to trip updates
  useEffect(() => {
    if (driverId && isTracking) {
      const tripId = LocationTrackingService.getActiveTripId();
      if (tripId) {
        const unsubscribe = LocationApiService.subscribeToTripUpdates(
          tripId,
          (trip) => {
            setTripData(trip);
          }
        );

        return unsubscribe;
      }
    }
    return () => {}; // Return empty cleanup function
  }, [driverId, isTracking]);

  // Initial status check
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return {
    isTracking,
    currentLocation,
    tripData,
    permissionsGranted,
    loading,
    startTrip,
    stopTrip,
    requestPermissions,
    forceLocationUpdate,
    refreshStatus: checkStatus,
  };
};
