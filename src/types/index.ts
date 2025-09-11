// src/types/index.ts
export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "driver" | "manager" | "admin";
  companyId: string;
  phoneNumber?: string;
  driverLicense?: {
    number: string;
    expiry: string;
    type: string;
    documentUrl?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  status: "active" | "inactive";
  createdAt: Date;
  lastLogin?: Date;
}

export interface Vehicle {
  id: string;
  registrationNo: string;
  fleetNo: string;
  manufacturer: string;
  model: string;
  year: string;
  assetGroup: string;
  assetType: string;
  capacity: string;
  poweredBy: string;
  chassisNo: string;
  engineNo: string;
  companyId: string;
  status: "available" | "in-use" | "maintenance" | "out-of-service";
  currentMileage: number;
  lastService?: {
    date: Date;
    mileage: number;
    type: string;
  };
  nextServiceDue?: {
    date: Date;
    mileage: number;
  };
  qrCodeId?: string;
  documents?: {
    insurance?: string;
    registration?: string;
  };
  currentDriverId?: string;
  createdAt: Date;
  updatedAt: Date;
  // Additional properties referenced in the code
  licensePlate?: string;
  make?: string;
  color?: string;
  fuelType?: string;
  seatingCapacity?: number;
  currentOdometer?: number;
}

export interface VehicleCheckIn {
  id: string;
  vehicleId: string;
  driverId: string;
  companyId: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  mileage: number;
  fuelLevel: string;
  vehicleCondition: {
    exterior: "excellent" | "good" | "fair" | "poor";
    interior: "excellent" | "good" | "fair" | "poor";
    tires: "excellent" | "good" | "fair" | "poor";
    damages: string[];
  };
  photos?: {
    dashboard?: string;
    exterior?: string;
    damages?: string[];
  };
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  companyId: string;
  type: "scheduled" | "unscheduled" | "emergency";
  serviceDate: Date;
  mileage: number;
  serviceProvider?: {
    name: string;
    contact: string;
  };
  services: string[];
  cost: number;
  nextServiceDue?: {
    date: Date;
    mileage: number;
  };
  attachments?: {
    invoice?: string;
    report?: string;
  };
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

export interface LocationUpdate {
  vehicleId: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    accuracy?: number;
  };
  driver?: {
    id: string;
    name: string;
  };
}

export interface Geofence {
  id: string;
  name: string;
  type: "circular" | "polygon";
  coordinates: {
    center?: {
      latitude: number;
      longitude: number;
    };
    radius?: number;
    points?: Array<{
      latitude: number;
      longitude: number;
    }>;
  };
  alerts: {
    onEntry: boolean;
    onExit: boolean;
    onDwell: boolean;
    dwellTime?: number;
  };
}

export interface VehicleQRData {
  vehicleId: string;
  fleetNumber: string;
  registrationNumber: string;
  checkpointType: "start" | "end" | "inspection";
  timestamp: number;
  validUntil: number;
}

export interface MaintenanceAlert {
  id: string;
  vehicleId: string;
  type: "upcoming" | "overdue";
  maintenanceType: string;
  dueDate: Date;
  mileageThreshold?: number;
  currentMileage?: number;
  priority: "low" | "medium" | "high";
  status: "pending" | "acknowledged";
}

export interface VehicleMetrics {
  vehicleId: string;
  period: "daily" | "weekly" | "monthly";
  metrics: {
    totalDistance: number;
    fuelConsumption: number;
    idleTime: number;
    activeTime: number;
    averageSpeed: number;
    harshBraking: number;
    harshAcceleration: number;
  };
}

export interface LocationData {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp: Date;
}

export interface TripData {
  id: string;
  driverId: string;
  vehicleId: string;
  startTime: Date | any; // Firebase Timestamp
  endTime?: Date | any; // Firebase Timestamp
  startLocation: LocationData;
  endLocation?: LocationData;
  locations: LocationData[];
  status: "active" | "completed" | "cancelled";
  totalDistance: number;
  averageSpeed: number;
  duration: number;
  fuelConsumption?: number;
  lastUpdated?: Date | any;
}

export interface BarcodeScanResult {
  success: boolean;
  vehicle?: Vehicle;
  barcodeData?: string;
  error?: string;
  timestamp: Date;
}

// Additional types for QR and analytics
export interface VehicleBarcode {
  id: string;
  vehicleId: string;
  barcodeData: string;
  createdAt: Date | any; // Firebase Timestamp
  createdBy: string;
  isActive: boolean;
  expiresAt?: Date | any;
}

export interface FleetAnalytics {
  totalVehicles: number;
  activeVehicles: number;
  totalDrivers: number;
  activeDrivers: number;
  totalTrips: number;
  completedTrips: number;
  averageTripDuration: number;
  totalDistance: number;
  averageFuelConsumption: number;
  maintenanceAlerts: number;
  overdueMaintenance: number;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  VehicleDetails: { vehicleId: string };
  CheckInForm: { vehicleId: string };
  MaintenanceDetails: { maintenanceId: string };
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Vehicles: undefined;
  Maintenance: undefined;
  Analytics: undefined;
};
