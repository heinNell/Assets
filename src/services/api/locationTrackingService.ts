// src/services/api/locationTrackingService.ts
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { LocationApiService } from './locationApi';
import { LocationData, TripData } from '../../types';

export class LocationTrackingService {
  private static readonly LOCATION_TASK_NAME = 'BACKGROUND_LOCATION_TASK';
  private static activeTripId: string | null = null;
  private static locationSubscription: Location.LocationSubscription | null = null;
  private static backgroundTaskRegistered = false;

  /**
   * Request location permissions
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

      return foregroundStatus === 'granted' && backgroundStatus === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  /**
   * Check if location permissions are granted
   */
  static async checkPermissions(): Promise<{
    foreground: boolean;
    background: boolean;
  }> {
    try {
      const foreground = await Location.getForegroundPermissionsAsync();
      const background = await Location.getBackgroundPermissionsAsync();

      return {
        foreground: foreground.status === 'granted',
        background: background.status === 'granted',
      };
    } catch (error) {
      console.error('Error checking permissions:', error);
      return { foreground: false, background: false };
    }
  }

  /**
   * Get current location
   */
  static async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
        accuracy: location.coords.accuracy,
        speed: location.coords.speed,
        heading: location.coords.heading,
        timestamp: new Date(location.timestamp),
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * Start location tracking for a trip
   */
  static async startTripTracking(driverId: string, vehicleId: string): Promise<string | null> {
    try {
      // Check permissions
      const permissions = await this.checkPermissions();
      if (!permissions.foreground) {
        throw new Error('Foreground location permission required');
      }

      // Get initial location
      const initialLocation = await this.getCurrentLocation();
      if (!initialLocation) {
        throw new Error('Unable to get initial location');
      }

      // Start trip in database
      const tripId = await LocationApiService.startTrip(driverId, vehicleId, initialLocation);
      this.activeTripId = tripId;

      // Start foreground tracking
      await this.startForegroundTracking(tripId);

      // Start background tracking if permission granted
      if (permissions.background) {
        await this.startBackgroundTracking(tripId);
      }

      return tripId;
    } catch (error) {
      console.error('Error starting trip tracking:', error);
      return null;
    }
  }

  /**
   * Stop location tracking
   */
  static async stopTripTracking(): Promise<TripData | null> {
    try {
      if (!this.activeTripId) {
        return null;
      }

      // Get final location
      const finalLocation = await this.getCurrentLocation();
      if (!finalLocation) {
        throw new Error('Unable to get final location');
      }

      // Stop foreground tracking
      await this.stopForegroundTracking();

      // Stop background tracking
      await this.stopBackgroundTracking();

      // End trip in database
      const tripData = await LocationApiService.endTrip(this.activeTripId, finalLocation);
      this.activeTripId = null;

      return tripData;
    } catch (error) {
      console.error('Error stopping trip tracking:', error);
      return null;
    }
  }

  /**
   * Start foreground location tracking
   */
  private static async startForegroundTracking(tripId: string): Promise<void> {
    try {
      // Stop existing subscription
      await this.stopForegroundTracking();

      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        async (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude,
            accuracy: location.coords.accuracy,
            speed: location.coords.speed,
            heading: location.coords.heading,
            timestamp: new Date(location.timestamp),
          };

          try {
            // Update driver's current location
            await LocationApiService.updateDriverLocation(
              'current-driver-id', // This should be passed from auth context
              locationData,
              tripId
            );

            // Add location to trip
            await LocationApiService.addTripLocation(tripId, locationData);
          } catch (error) {
            console.error('Error updating location:', error);
          }
        }
      );
    } catch (error) {
      console.error('Error starting foreground tracking:', error);
      throw error;
    }
  }

  /**
   * Stop foreground location tracking
   */
  private static async stopForegroundTracking(): Promise<void> {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  /**
   * Start background location tracking
   */
  private static async startBackgroundTracking(tripId: string): Promise<void> {
    try {
      // Register background task if not already registered
      if (!this.backgroundTaskRegistered) {
        TaskManager.defineTask(this.LOCATION_TASK_NAME, async ({ data, error }) => {
          if (error) {
            console.error('Background location task error:', error);
            return;
          }

          if (data) {
            const { locations } = data as { locations: Location.LocationObject[] };

            for (const location of locations) {
              const locationData: LocationData = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                altitude: location.coords.altitude,
                accuracy: location.coords.accuracy,
                speed: location.coords.speed,
                heading: location.coords.heading,
                timestamp: new Date(location.timestamp),
              };

              try {
                // Update location in background
                await LocationApiService.updateDriverLocation(
                  'current-driver-id', // This should be passed from auth context
                  locationData,
                  tripId
                );

                if (tripId) {
                  await LocationApiService.addTripLocation(tripId, locationData);
                }
              } catch (error) {
                console.error('Error updating background location:', error);
              }
            }
          }
        });

        this.backgroundTaskRegistered = true;
      }

      // Start background location updates
      await Location.startLocationUpdatesAsync(this.LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 30000, // Update every 30 seconds in background
        distanceInterval: 50, // Update every 50 meters in background
        showsBackgroundLocationIndicator: true,
      });
    } catch (error) {
      console.error('Error starting background tracking:', error);
      throw error;
    }
  }

  /**
   * Stop background location tracking
   */
  private static async stopBackgroundTracking(): Promise<void> {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(this.LOCATION_TASK_NAME);
      if (isRegistered) {
        await Location.stopLocationUpdatesAsync(this.LOCATION_TASK_NAME);
      }
    } catch (error) {
      console.error('Error stopping background tracking:', error);
    }
  }

  /**
   * Get active trip ID
   */
  static getActiveTripId(): string | null {
    return this.activeTripId;
  }

  /**
   * Check if tracking is active
   */
  static isTrackingActive(): boolean {
    return this.activeTripId !== null;
  }

  /**
   * Get trip status
   */
  static async getTripStatus(driverId: string): Promise<{
    isActive: boolean;
    tripId: string | null;
    tripData: TripData | null;
  }> {
    try {
      const tripData = await LocationApiService.getActiveTrip(driverId);

      return {
        isActive: !!tripData,
        tripId: tripData?.id || null,
        tripData,
      };
    } catch (error) {
      console.error('Error getting trip status:', error);
      return {
        isActive: false,
        tripId: null,
        tripData: null,
      };
    }
  }

  /**
   * Force location update (useful for testing)
   */
  static async forceLocationUpdate(): Promise<void> {
    if (!this.activeTripId) return;

    const location = await this.getCurrentLocation();
    if (location) {
      await LocationApiService.updateDriverLocation(
        'current-driver-id', // This should be passed from auth context
        location,
        this.activeTripId
      );
      await LocationApiService.addTripLocation(this.activeTripId, location);
    }
  }
}
