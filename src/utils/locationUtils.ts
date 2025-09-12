// src/utils/locationUtils.ts
import * as Location from 'expo-location';

/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in meters
 */
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Helper function to convert degrees to radians
const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculate total distance of a route from an array of locations
 * @param locations Array of locations with latitude and longitude
 * @returns Total distance in meters
 */
export const calculateRouteDistance = (
  locations: { latitude: number; longitude: number }[]
): number => {
  if (!locations || locations.length < 2) return 0;
  
  let totalDistance = 0;
  
  for (let i = 1; i < locations.length; i++) {
    const prev = locations[i - 1];
    const current = locations[i];
    
    totalDistance += calculateDistance(
      prev.latitude, 
      prev.longitude, 
      current.latitude, 
      current.longitude
    );
  }
  
  return totalDistance;
};

/**
 * Request location permissions for the app
 * @param askForBackground Whether to ask for background permissions
 * @returns Object with foreground and background permission status
 */
export const requestLocationPermissions = async (
  askForBackground = false
): Promise<{
  foregroundStatus: Location.PermissionStatus;
  backgroundStatus?: Location.PermissionStatus;
}> => {
  // Always request foreground permissions first
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  
  // Only request background permissions if foreground is granted and we need them
  if (foregroundStatus === 'granted' && askForBackground) {
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    return { foregroundStatus, backgroundStatus };
  }
  
  return { foregroundStatus };
};

/**
 * Get the current location with high accuracy
 * @returns Promise resolving to location object
 */
export const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }
  
  return await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High
  });
};

/**
 * Format coordinates as a readable string
 * @param latitude Latitude
 * @param longitude Longitude
 * @returns Formatted coordinate string
 */
export const formatCoordinates = (
  latitude: number,
  longitude: number
): string => {
  if (!latitude || !longitude) return '';
  
  const latDirection = latitude >= 0 ? 'N' : 'S';
  const lonDirection = longitude >= 0 ? 'E' : 'W';
  
  const latDegrees = Math.abs(latitude).toFixed(6);
  const lonDegrees = Math.abs(longitude).toFixed(6);
  
  return `${latDegrees}° ${latDirection}, ${lonDegrees}° ${lonDirection}`;
};