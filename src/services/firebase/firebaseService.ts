// src/services/firebase/firebaseService.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./config";
import { FIREBASE_COLLECTIONS } from "../../constants";
import {
  User,
  Vehicle,
  VehicleCheckIn,
  MaintenanceRecord,
  LocationUpdate,
  FleetAnalytics,
  VehicleMetrics,
} from "../../types";

// User Services
export const userService = {
  async getUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, FIREBASE_COLLECTIONS.USERS, userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, FIREBASE_COLLECTIONS.USERS, userId), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async getUsersByCompany(companyId: string): Promise<User[]> {
    try {
      const q = query(
        collection(db, FIREBASE_COLLECTIONS.USERS),
        where("companyId", "==", companyId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as User)
      );
    } catch (error) {
      console.error("Error fetching company users:", error);
      throw error;
    }
  },
};

// Vehicle Services
export const vehicleService = {
  async getVehicle(vehicleId: string): Promise<Vehicle | null> {
    try {
      const vehicleDoc = await getDoc(
        doc(db, FIREBASE_COLLECTIONS.VEHICLES, vehicleId)
      );
      if (vehicleDoc.exists()) {
        return { id: vehicleDoc.id, ...vehicleDoc.data() } as Vehicle;
      }
      return null;
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      throw error;
    }
  },

  async getVehiclesByCompany(companyId: string): Promise<Vehicle[]> {
    try {
      const q = query(
        collection(db, FIREBASE_COLLECTIONS.VEHICLES),
        where("companyId", "==", companyId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Vehicle)
      );
    } catch (error) {
      console.error("Error fetching company vehicles:", error);
      throw error;
    }
  },

  async getVehicleByLicensePlate(
    licensePlate: string,
    companyId: string
  ): Promise<Vehicle | null> {
    try {
      const q = query(
        collection(db, FIREBASE_COLLECTIONS.VEHICLES),
        where("licensePlate", "==", licensePlate),
        where("companyId", "==", companyId)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        if (doc) {
          return { id: doc.id, ...doc.data() } as Vehicle;
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching vehicle by license plate:", error);
      throw error;
    }
  },

  async updateVehicle(
    vehicleId: string,
    updates: Partial<Vehicle>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, FIREBASE_COLLECTIONS.VEHICLES, vehicleId), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating vehicle:", error);
      throw error;
    }
  },

  async createVehicle(
    vehicleData: Omit<Vehicle, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(db, FIREBASE_COLLECTIONS.VEHICLES),
        {
          ...vehicleData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
      );
      return docRef.id;
    } catch (error) {
      console.error("Error creating vehicle:", error);
      throw error;
    }
  },
};

// Check-in Services
export const checkInService = {
  async createCheckIn(
    checkInData: Omit<VehicleCheckIn, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(db, FIREBASE_COLLECTIONS.CHECK_INS),
        {
          ...checkInData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
      );
      return docRef.id;
    } catch (error) {
      console.error("Error creating check-in:", error);
      throw error;
    }
  },

  async getActiveCheckIn(vehicleId: string): Promise<VehicleCheckIn | null> {
    try {
      const q = query(
        collection(db, FIREBASE_COLLECTIONS.CHECK_INS),
        where("vehicleId", "==", vehicleId),
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        if (doc) {
          return { id: doc.id, ...doc.data() } as VehicleCheckIn;
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching active check-in:", error);
      throw error;
    }
  },

  async completeCheckIn(checkInId: string, checkOutData: any): Promise<void> {
    try {
      await updateDoc(doc(db, FIREBASE_COLLECTIONS.CHECK_INS, checkInId), {
        ...checkOutData,
        status: "completed",
        checkOutTime: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error completing check-in:", error);
      throw error;
    }
  },

  async getCheckInsByDriver(
    driverId: string,
    limitCount: number = 20
  ): Promise<VehicleCheckIn[]> {
    try {
      const q = query(
        collection(db, FIREBASE_COLLECTIONS.CHECK_INS),
        where("driverId", "==", driverId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as VehicleCheckIn)
      );
    } catch (error) {
      console.error("Error fetching driver check-ins:", error);
      throw error;
    }
  },
};

// Maintenance Services
export const maintenanceService = {
  async createMaintenanceRecord(
    recordData: Omit<MaintenanceRecord, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(db, FIREBASE_COLLECTIONS.MAINTENANCE),
        {
          ...recordData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
      );
      return docRef.id;
    } catch (error) {
      console.error("Error creating maintenance record:", error);
      throw error;
    }
  },

  async getMaintenanceRecords(vehicleId: string): Promise<MaintenanceRecord[]> {
    try {
      const q = query(
        collection(db, FIREBASE_COLLECTIONS.MAINTENANCE),
        where("vehicleId", "==", vehicleId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as MaintenanceRecord)
      );
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
      throw error;
    }
  },

  async updateMaintenanceRecord(
    recordId: string,
    updates: Partial<MaintenanceRecord>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, FIREBASE_COLLECTIONS.MAINTENANCE, recordId), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating maintenance record:", error);
      throw error;
    }
  },
};

// Location Services
export const locationService = {
  async saveLocationUpdate(
    locationData: Omit<LocationUpdate, "id" | "createdAt">
  ): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(db, FIREBASE_COLLECTIONS.LOCATION_UPDATES),
        {
          ...locationData,
          createdAt: Timestamp.now(),
        }
      );
      return docRef.id;
    } catch (error) {
      console.error("Error saving location update:", error);
      throw error;
    }
  },

  async getLocationHistory(
    vehicleId: string,
    startDate: Date,
    endDate: Date
  ): Promise<LocationUpdate[]> {
    try {
      const q = query(
        collection(db, FIREBASE_COLLECTIONS.LOCATION_UPDATES),
        where("vehicleId", "==", vehicleId),
        where("timestamp", ">=", Timestamp.fromDate(startDate)),
        where("timestamp", "<=", Timestamp.fromDate(endDate)),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as LocationUpdate)
      );
    } catch (error) {
      console.error("Error fetching location history:", error);
      throw error;
    }
  },
};

// Storage Services
export const storageService = {
  async uploadImage(uri: string, path: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  async deleteImage(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  },
};

// Analytics Services
export const analyticsService = {
  async getFleetAnalytics(companyId: string): Promise<FleetAnalytics> {
    try {
      // This would typically aggregate data from multiple collections
      // For now, returning a basic structure
      const vehicles = await vehicleService.getVehiclesByCompany(companyId);
      const users = await userService.getUsersByCompany(companyId);

      return {
        totalVehicles: vehicles.length,
        activeVehicles: vehicles.filter((v) => v.status === "in-use").length,
        totalDrivers: users.filter((u) => u.role === "driver").length,
        maintenanceDue: vehicles.filter(
          (v) =>
            v.nextServiceDue?.date &&
            v.nextServiceDue.date.toDate() < new Date()
        ).length,
        utilizationRate: 0, // Would need to calculate from check-in data
        averageMileage: 0, // Would need to calculate from vehicle data
        fuelEfficiency: 0, // Would need to calculate from check-in data
        lastUpdated: Timestamp.now(),
      };
    } catch (error) {
      console.error("Error fetching fleet analytics:", error);
      throw error;
    }
  },

  async getVehicleMetrics(vehicleId: string): Promise<VehicleMetrics> {
    try {
      const vehicle = await vehicleService.getVehicle(vehicleId);
      if (!vehicle) throw new Error("Vehicle not found");

      // Get recent check-ins for metrics calculation
      const checkIns = await checkInService.getCheckInsByDriver("", 50); // Would need to filter by vehicle
      const maintenanceRecords = await maintenanceService.getMaintenanceRecords(
        vehicleId
      );

      return {
        vehicleId,
        totalMileage: vehicle.currentMileage,
        fuelEfficiency: 0, // Calculate from check-in data
        maintenanceCost: maintenanceRecords.reduce(
          (sum, record) => sum + (record.cost || 0),
          0
        ),
        downtimeHours: 0, // Calculate from maintenance records
        utilizationHours: 0, // Calculate from check-in data
        lastServiceDate: vehicle.lastService?.date,
        nextServiceDate: vehicle.nextServiceDue?.date,
        lastUpdated: Timestamp.now(),
      };
    } catch (error) {
      console.error("Error fetching vehicle metrics:", error);
      throw error;
    }
  },
};

// Real-time listeners
export const realtimeService = {
  subscribeToVehicleUpdates(
    companyId: string,
    callback: (vehicles: Vehicle[]) => void
  ) {
    const q = query(
      collection(db, FIREBASE_COLLECTIONS.VEHICLES),
      where("companyId", "==", companyId)
    );

    return onSnapshot(q, (snapshot) => {
      const vehicles = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Vehicle)
      );
      callback(vehicles);
    });
  },

  subscribeToCheckInUpdates(
    vehicleId: string,
    callback: (checkIn: VehicleCheckIn | null) => void
  ) {
    const q = query(
      collection(db, FIREBASE_COLLECTIONS.CHECK_INS),
      where("vehicleId", "==", vehicleId),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty && snapshot.docs[0]) {
        const checkIn = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
        } as VehicleCheckIn;
        callback(checkIn);
      } else {
        callback(null);
      }
    });
  },
};
