// src/services/LocationService.ts
import * as Location from "expo-location";
import { LocationData, Geofence } from "../types";

export class LocationService {
  private static watchId: Location.LocationSubscription | null = null;

  /**
   * Request location permissions
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission denied");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error requesting location permissions:", error);
      return false;
    }
  }

  /**
   * Get current location
   */
  static async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: new Date(location.timestamp),
        speed: location.coords.speed,
        heading: location.coords.heading,
      };
    } catch (error) {
      console.error("Error getting current location:", error);
      return null;
    }
  }

  /**
   * Start location tracking
   */
  static async startLocationTracking(
    callback: (location: LocationData) => void,
    options: {
      accuracy?: Location.Accuracy;
      timeInterval?: number;
      distanceInterval?: number;
    } = {}
  ): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return false;

      // Stop existing tracking
      await this.stopLocationTracking();

      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: options.accuracy || Location.Accuracy.High,
          timeInterval: options.timeInterval || 5000, // 5 seconds
          distanceInterval: options.distanceInterval || 10, // 10 meters
        },
        (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: new Date(location.timestamp),
            speed: location.coords.speed,
            heading: location.coords.heading,
          };
          callback(locationData);
        }
      );

      return true;
    } catch (error) {
      console.error("Error starting location tracking:", error);
      return false;
    }
  }

  /**
   * Stop location tracking
   */
  static async stopLocationTracking(): Promise<void> {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
    }
  }

  /**
   * Calculate distance between two points (in meters)
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Check if location is within geofence
   */
  static isWithinGeofence(location: LocationData, geofence: Geofence): boolean {
    const distance = this.calculateDistance(
      location.latitude,
      location.longitude,
      geofence.latitude,
      geofence.longitude
    );

    return distance <= geofence.radius;
  }

  /**
   * Get address from coordinates (reverse geocoding)
   */
  static async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<string | null> {
    try {
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        return `${addr.street || ""} ${addr.city || ""}, ${addr.region || ""} ${
          addr.postalCode || ""
        }`.trim();
      }

      return null;
    } catch (error) {
      console.error("Error getting address from coordinates:", error);
      return null;
    }
  }

  /**
   * Get coordinates from address (geocoding)
   */
  static async getCoordinatesFromAddress(
    address: string
  ): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const locations = await Location.geocodeAsync(address);

      if (locations.length > 0) {
        return {
          latitude: locations[0].latitude,
          longitude: locations[0].longitude,
        };
      }

      return null;
    } catch (error) {
      console.error("Error getting coordinates from address:", error);
      return null;
    }
  }
}
