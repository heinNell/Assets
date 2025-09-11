// src/services/api/locationApi.ts
import { collection, doc, setDoc, getDoc, updateDoc, query, where, orderBy, onSnapshot, Timestamp, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { LocationData, TripData, Geofence } from '../../types';

export class LocationApiService {
  private static readonly LOCATIONS_COLLECTION = 'driverLocations';
  private static readonly TRIPS_COLLECTION = 'trips';
  private static readonly GEOFENCES_COLLECTION = 'geofences';

  /**
   * Start location tracking for a driver
   */
  static async startTrip(driverId: string, vehicleId: string, initialLocation: LocationData): Promise<string> {
    try {
      const tripId = `trip_${Date.now()}_${driverId}`;
      const tripData: TripData = {
        id: tripId,
        driverId,
        vehicleId,
        startTime: Timestamp.now(),
        status: 'active',
        startLocation: initialLocation,
        locations: [initialLocation],
        totalDistance: 0,
        averageSpeed: 0,
        fuelConsumption: 0,
      };

      const docRef = doc(db, this.TRIPS_COLLECTION, tripId);
      await setDoc(docRef, tripData);

      // Update driver's current location
      await this.updateDriverLocation(driverId, initialLocation, tripId);

      return tripId;
    } catch (error) {
      console.error('Error starting trip:', error);
      throw new Error('Failed to start trip');
    }
  }

  /**
   * Update driver's current location
   */
  static async updateDriverLocation(
    driverId: string,
    location: LocationData,
    tripId?: string
  ): Promise<void> {
    try {
      const locationData = {
        driverId,
        location,
        tripId,
        timestamp: Timestamp.now(),
        lastUpdated: Timestamp.now(),
      };

      const docRef = doc(db, this.LOCATIONS_COLLECTION, driverId);
      await setDoc(docRef, locationData, { merge: true });
    } catch (error) {
      console.error('Error updating driver location:', error);
      throw new Error('Failed to update location');
    }
  }

  /**
   * Add location point to active trip
   */
  static async addTripLocation(tripId: string, location: LocationData): Promise<void> {
    try {
      const tripRef = doc(db, this.TRIPS_COLLECTION, tripId);
      const tripSnap = await getDoc(tripRef);

      if (!tripSnap.exists()) {
        throw new Error('Trip not found');
      }

      const tripData = tripSnap.data() as TripData;
      const updatedLocations = [...(tripData.locations || []), location];

      // Calculate distance and speed (simplified)
      const distance = this.calculateDistance(updatedLocations);
      const averageSpeed = this.calculateAverageSpeed(updatedLocations);

      await updateDoc(tripRef, {
        locations: updatedLocations,
        totalDistance: distance,
        averageSpeed,
        lastUpdated: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding trip location:', error);
      throw new Error('Failed to add trip location');
    }
  }

  /**
   * End trip and calculate final statistics
   */
  static async endTrip(tripId: string, finalLocation: LocationData): Promise<TripData> {
    try {
      const tripRef = doc(db, this.TRIPS_COLLECTION, tripId);
      const tripSnap = await getDoc(tripRef);

      if (!tripSnap.exists()) {
        throw new Error('Trip not found');
      }

      const tripData = tripSnap.data() as TripData;
      const endTime = Timestamp.now();
      const duration = endTime.toMillis() - tripData.startTime.toMillis();

      const finalTripData: TripData = {
        ...tripData,
        endTime,
        endLocation: finalLocation,
        status: 'completed',
        duration,
        locations: [...(tripData.locations || []), finalLocation],
        totalDistance: this.calculateDistance([...(tripData.locations || []), finalLocation]),
        averageSpeed: this.calculateAverageSpeed([...(tripData.locations || []), finalLocation]),
        lastUpdated: Timestamp.now(),
      };

      await updateDoc(tripRef, finalTripData);

      // Clear driver's current location
      await this.clearDriverLocation(tripData.driverId);

      return finalTripData;
    } catch (error) {
      console.error('Error ending trip:', error);
      throw new Error('Failed to end trip');
    }
  }

  /**
   * Get active trip for driver
   */
  static async getActiveTrip(driverId: string): Promise<TripData | null> {
    try {
      const q = query(
        collection(db, this.TRIPS_COLLECTION),
        where('driverId', '==', driverId),
        where('status', '==', 'active'),
        orderBy('startTime', 'desc'),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;

      return snapshot.docs[0].data() as TripData;
    } catch (error) {
      console.error('Error getting active trip:', error);
      return null;
    }
  }

  /**
   * Get driver's current location
   */
  static async getDriverLocation(driverId: string): Promise<LocationData | null> {
    try {
      const docRef = doc(db, this.LOCATIONS_COLLECTION, driverId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.location;
      }

      return null;
    } catch (error) {
      console.error('Error getting driver location:', error);
      return null;
    }
  }

  /**
   * Subscribe to driver's location updates
   */
  static subscribeToDriverLocation(
    driverId: string,
    callback: (location: LocationData | null) => void
  ): () => void {
    const docRef = doc(db, this.LOCATIONS_COLLECTION, driverId);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback(data.location);
      } else {
        callback(null);
      }
    });

    return unsubscribe;
  }

  /**
   * Subscribe to trip updates
   */
  static subscribeToTripUpdates(
    tripId: string,
    callback: (trip: TripData | null) => void
  ): () => void {
    const docRef = doc(db, this.TRIPS_COLLECTION, tripId);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as TripData);
      } else {
        callback(null);
      }
    });

    return unsubscribe;
  }

  /**
   * Get trip history for driver
   */
  static async getTripHistory(driverId: string, limit: number = 10): Promise<TripData[]> {
    try {
      const q = query(
        collection(db, this.TRIPS_COLLECTION),
        where('driverId', '==', driverId),
        orderBy('startTime', 'desc'),
        limit(limit)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as TripData);
    } catch (error) {
      console.error('Error getting trip history:', error);
      return [];
    }
  }

  /**
   * Create geofence
   */
  static async createGeofence(geofence: Omit<Geofence, 'id'>): Promise<string> {
    try {
      const geofenceId = `geofence_${Date.now()}`;
      const geofenceData = {
        id: geofenceId,
        ...geofence,
        createdAt: Timestamp.now(),
      };

      const docRef = doc(db, this.GEOFENCES_COLLECTION, geofenceId);
      await setDoc(docRef, geofenceData);

      return geofenceId;
    } catch (error) {
      console.error('Error creating geofence:', error);
      throw new Error('Failed to create geofence');
    }
  }

  /**
   * Check if location is within geofence
   */
  static isLocationInGeofence(location: LocationData, geofence: Geofence): boolean {
    if (geofence.type === 'circular' && geofence.coordinates.center && geofence.coordinates.radius) {
      const distance = this.calculateDistanceBetweenPoints(
        location.latitude,
        location.longitude,
        geofence.coordinates.center.latitude,
        geofence.coordinates.center.longitude
      );
      return distance <= geofence.coordinates.radius;
    }

    // Polygon geofence logic would go here
    return false;
  }

  /**
   * Clear driver's location
   */
  private static async clearDriverLocation(driverId: string): Promise<void> {
    try {
      const docRef = doc(db, this.LOCATIONS_COLLECTION, driverId);
      await updateDoc(docRef, {
        tripId: null,
        lastUpdated: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error clearing driver location:', error);
    }
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private static calculateDistanceBetweenPoints(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Calculate total distance for a trip
   */
  private static calculateDistance(locations: LocationData[]): number {
    if (locations.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < locations.length; i++) {
      totalDistance += this.calculateDistanceBetweenPoints(
        locations[i - 1].latitude,
        locations[i - 1].longitude,
        locations[i].latitude,
        locations[i].longitude
      );
    }
    return totalDistance;
  }

  /**
   * Calculate average speed for a trip
   */
  private static calculateAverageSpeed(locations: LocationData[]): number {
    if (locations.length < 2) return 0;

    const totalDistance = this.calculateDistance(locations);
    const totalTime = locations[locations.length - 1].timestamp.getTime() - locations[0].timestamp.getTime();
    const hours = totalTime / (1000 * 60 * 60);

    return hours > 0 ? totalDistance / hours : 0;
  }

  /**
   * Convert degrees to radians
   */
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
