///Vehicle Barcode Management System - src/services/BarcodeService.ts

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase/config";
import { Vehicle, User } from "../types";

// QR Code format: FLEET_{REGISTRATION}_{FLEETNO}_{TIMESTAMP}_{RANDOM}
export interface VehicleBarcode {
  id: string;
  barcodeData: string;
  vehicleId: string;
  registrationNo: string;
  fleetNo: string;
  qrCodeUrl: string;
  isActive: boolean;
  createdAt: Timestamp;
  createdBy: string;
  lastScanned?: Timestamp;
  scanCount: number;
}

export interface BarcodeScanResult {
  success: boolean;
  vehicle?: Vehicle;
  barcode?: VehicleBarcode;
  error?: string;
}

export class BarcodeService {
  private static readonly COLLECTION = "vehicleBarcodes";

  /**
   * Generate a unique QR code data string for a vehicle
   */
  private static generateBarcodeData(vehicle: Vehicle): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `FLEET_${vehicle.registrationNo}_${
      vehicle.fleetNo || "N/A"
    }_${timestamp}_${random}`;
  }

  /**
   * Validate QR code format
   */
  private static validateBarcodeFormat(barcodeData: string): boolean {
    const pattern = /^FLEET_[A-Z0-9]+_[A-Z0-9]+_[A-Z0-9]+_[A-Z0-9]+$/;
    return pattern.test(barcodeData);
  }

  /**
   * Extract vehicle info from QR code data
   */
  private static parseBarcodeData(
    barcodeData: string
  ): { registrationNo: string; fleetNo: string } | null {
    if (!this.validateBarcodeFormat(barcodeData)) return null;

    const parts = barcodeData.split("_");
    if (parts.length !== 5) return null;

    return {
      registrationNo: parts[1],
      fleetNo: parts[2] === "N/A" ? "" : parts[2],
    };
  }

  /**
   * Create QR code for a vehicle
   */
  static async createVehicleBarcode(
    vehicle: Vehicle,
    createdBy: string
  ): Promise<VehicleBarcode> {
    try {
      const barcodeData = this.generateBarcodeData(vehicle);
      const barcodeId = `barcode_${vehicle.id}`;

      // Generate QR code image (placeholder - would integrate with QR library)
      const qrCodeUrl = await this.generateQRCodeImage(barcodeData);

      const barcode: VehicleBarcode = {
        id: barcodeId,
        barcodeData,
        vehicleId: vehicle.id,
        registrationNo: vehicle.registrationNo,
        fleetNo: vehicle.fleetNo || "",
        qrCodeUrl,
        isActive: true,
        createdAt: Timestamp.now(),
        createdBy,
        scanCount: 0,
      };

      const docRef = doc(db, this.COLLECTION, barcodeId);
      await setDoc(docRef, barcode);

      return barcode;
    } catch (error) {
      console.error("Error creating vehicle barcode:", error);
      throw new Error("Failed to create vehicle barcode");
    }
  }

  /**
   * Generate QR code image (placeholder implementation)
   */
  private static async generateQRCodeImage(data: string): Promise<string> {
    // In a real implementation, you would use a QR code library like qrcode
    // For now, return a placeholder URL
    const qrData = encodeURIComponent(data);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`;
  }

  /**
   * Scan and validate QR code
   */
  static async scanVehicleQR(
    barcodeData: string,
    scannedBy: string
  ): Promise<BarcodeScanResult> {
    try {
      // Validate format
      if (!this.validateBarcodeFormat(barcodeData)) {
        return {
          success: false,
          error: "Invalid QR code format",
        };
      }

      // Parse barcode data
      const parsedData = this.parseBarcodeData(barcodeData);
      if (!parsedData) {
        return {
          success: false,
          error: "Unable to parse QR code data",
        };
      }

      // Find vehicle by registration number
      const vehicle = await this.findVehicleByRegistration(
        parsedData.registrationNo
      );
      if (!vehicle) {
        return {
          success: false,
          error: "Vehicle not found in fleet",
        };
      }

      // Find barcode record
      const barcode = await this.getVehicleBarcode(vehicle.id);
      if (!barcode) {
        return {
          success: false,
          error: "QR code not registered for this vehicle",
        };
      }

      // Check if barcode is active
      if (!barcode.isActive) {
        return {
          success: false,
          error: "QR code is inactive",
        };
      }

      // Update scan statistics
      await this.updateScanStats(barcode.id, scannedBy);

      return {
        success: true,
        vehicle,
        barcode,
      };
    } catch (error) {
      console.error("Error scanning QR code:", error);
      return {
        success: false,
        error: "Failed to process QR code",
      };
    }
  }

  /**
   * Find vehicle by registration number
   */
  private static async findVehicleByRegistration(
    registrationNo: string
  ): Promise<Vehicle | null> {
    try {
      const vehiclesRef = collection(db, "vehicles");
      const q = query(vehiclesRef, where("licensePlate", "==", registrationNo));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Vehicle;
    } catch (error) {
      console.error("Error finding vehicle:", error);
      return null;
    }
  }

  /**
   * Get vehicle barcode by vehicle ID
   */
  static async getVehicleBarcode(
    vehicleId: string
  ): Promise<VehicleBarcode | null> {
    try {
      const docRef = doc(db, this.COLLECTION, `barcode_${vehicleId}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as VehicleBarcode;
      }

      return null;
    } catch (error) {
      console.error("Error getting vehicle barcode:", error);
      return null;
    }
  }

  /**
   * Update scan statistics
   */
  private static async updateScanStats(
    barcodeId: string,
    scannedBy: string
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, barcodeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data() as VehicleBarcode;
        await setDoc(docRef, {
          ...currentData,
          lastScanned: Timestamp.now(),
          scanCount: currentData.scanCount + 1,
        });
      }
    } catch (error) {
      console.error("Error updating scan stats:", error);
    }
  }

  /**
   * Get all vehicle barcodes for a company
   */
  static async getCompanyBarcodes(
    companyId: string
  ): Promise<VehicleBarcode[]> {
    try {
      // First get all vehicles for the company
      const vehiclesRef = collection(db, "vehicles");
      const vehiclesQuery = query(
        vehiclesRef,
        where("companyId", "==", companyId)
      );
      const vehiclesSnapshot = await getDocs(vehiclesQuery);

      const barcodes: VehicleBarcode[] = [];

      for (const vehicleDoc of vehiclesSnapshot.docs) {
        const barcode = await this.getVehicleBarcode(vehicleDoc.id);
        if (barcode) {
          barcodes.push(barcode);
        }
      }

      return barcodes.sort(
        (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
      );
    } catch (error) {
      console.error("Error getting company barcodes:", error);
      return [];
    }
  }

  /**
   * Deactivate a vehicle barcode
   */
  static async deactivateBarcode(vehicleId: string): Promise<boolean> {
    try {
      const barcode = await this.getVehicleBarcode(vehicleId);
      if (!barcode) return false;

      const docRef = doc(db, this.COLLECTION, barcode.id);
      await setDoc(docRef, { ...barcode, isActive: false });

      return true;
    } catch (error) {
      console.error("Error deactivating barcode:", error);
      return false;
    }
  }

  /**
   * Reactivate a vehicle barcode
   */
  static async reactivateBarcode(vehicleId: string): Promise<boolean> {
    try {
      const barcode = await this.getVehicleBarcode(vehicleId);
      if (!barcode) return false;

      const docRef = doc(db, this.COLLECTION, barcode.id);
      await setDoc(docRef, { ...barcode, isActive: true });

      return true;
    } catch (error) {
      console.error("Error reactivating barcode:", error);
      return false;
    }
  }

  /**
   * Generate QR codes for vehicles that don't have them
   */
  static async generateMissingBarcodes(
    companyId: string,
    createdBy: string
  ): Promise<number> {
    try {
      // Get all vehicles for the company
      const vehiclesRef = collection(db, "vehicles");
      const vehiclesQuery = query(
        vehiclesRef,
        where("companyId", "==", companyId)
      );
      const vehiclesSnapshot = await getDocs(vehiclesQuery);

      let generatedCount = 0;

      for (const vehicleDoc of vehiclesSnapshot.docs) {
        const vehicle = { id: vehicleDoc.id, ...vehicleDoc.data() } as Vehicle;

        // Check if barcode already exists
        const existingBarcode = await this.getVehicleBarcode(vehicle.id);
        if (!existingBarcode) {
          await this.createVehicleBarcode(vehicle, createdBy);
          generatedCount++;
        }
      }

      return generatedCount;
    } catch (error) {
      console.error("Error generating missing barcodes:", error);
      return 0;
    }
  }

  /**
   * Get barcode statistics for a company
   */
  static async getBarcodeStats(companyId: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    totalScans: number;
  }> {
    try {
      const barcodes = await this.getCompanyBarcodes(companyId);

      const stats = {
        total: barcodes.length,
        active: barcodes.filter((b) => b.isActive).length,
        inactive: barcodes.filter((b) => !b.isActive).length,
        totalScans: barcodes.reduce((sum, b) => sum + b.scanCount, 0),
      };

      return stats;
    } catch (error) {
      console.error("Error getting barcode stats:", error);
      return { total: 0, active: 0, inactive: 0, totalScans: 0 };
    }
  }

  /**
   * Seed fleet vehicles with QR codes (one-time setup)
   */
  static async seedFleetVehicles(
    companyId: string,
    createdBy: string
  ): Promise<void> {
    try {
      console.log("Seeding fleet vehicles with QR codes...");

      const generatedCount = await this.generateMissingBarcodes(
        companyId,
        createdBy
      );

      console.log(`Generated ${generatedCount} QR codes for fleet vehicles`);
    } catch (error) {
      console.error("Error seeding fleet vehicles:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const barcodeService = BarcodeService;
