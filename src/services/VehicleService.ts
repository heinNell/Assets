// src/services/VehicleService.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { FIREBASE_COLLECTIONS } from "../constants";
import { Vehicle, VehicleItem } from "../types";

export class VehicleService {
  // Get all vehicles for a company
  static async getVehicles(companyId: string): Promise<Vehicle[]> {
    try {
      const q = query(
        collection(db, FIREBASE_COLLECTIONS.VEHICLES),
        where("companyId", "==", companyId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Vehicle)
      );
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  }

  // Get vehicle by ID
  static async getVehicleById(vehicleId: string): Promise<Vehicle | null> {
    try {
      const docRef = doc(db, FIREBASE_COLLECTIONS.VEHICLES, vehicleId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Vehicle;
      }
      return null;
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      throw error;
    }
  }

  // Get vehicle by QR code
  static async getVehicleByQRCode(qrCodeId: string): Promise<Vehicle | null> {
    try {
      const q = query(
        collection(db, FIREBASE_COLLECTIONS.VEHICLES),
        where("qrCodeId", "==", qrCodeId)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
        } as Vehicle;
      }
      return null;
    } catch (error) {
      console.error("Error fetching vehicle by QR code:", error);
      throw error;
    }
  }

  // Add new vehicle
  static async addVehicle(vehicleData: Omit<Vehicle, "id">): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(db, FIREBASE_COLLECTIONS.VEHICLES),
        {
          ...vehicleData,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
      return docRef.id;
    } catch (error) {
      console.error("Error adding vehicle:", error);
      throw error;
    }
  }

  // Update vehicle
  static async updateVehicle(
    vehicleId: string,
    updates: Partial<Vehicle>
  ): Promise<void> {
    try {
      const docRef = doc(db, FIREBASE_COLLECTIONS.VEHICLES, vehicleId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating vehicle:", error);
      throw error;
    }
  }

  // Delete vehicle
  static async deleteVehicle(vehicleId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, FIREBASE_COLLECTIONS.VEHICLES, vehicleId));
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      throw error;
    }
  }

  // Get vehicles for display (simplified format)
  static async getVehicleItems(companyId: string): Promise<VehicleItem[]> {
    try {
      const vehicles = await this.getVehicles(companyId);
      return vehicles.map((vehicle) => ({
        id: vehicle.id,
        make: vehicle.manufacturer || vehicle.make || "",
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.registrationNo || vehicle.licensePlate || "",
        status: vehicle.status,
        currentOdometer: vehicle.currentMileage,
      }));
    } catch (error) {
      console.error("Error fetching vehicle items:", error);
      throw error;
    }
  }
}

export const useVehicleService = () => {
  return {
    getVehicles: VehicleService.getVehicles,
    getVehicleById: VehicleService.getVehicleById,
    getVehicleByQRCode: VehicleService.getVehicleByQRCode,
    addVehicle: VehicleService.addVehicle,
    updateVehicle: VehicleService.updateVehicle,
    deleteVehicle: VehicleService.deleteVehicle,
    getVehicleItems: VehicleService.getVehicleItems,
  };
};
