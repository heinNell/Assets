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

export interface FleetAnalytics {
  fleetUtilization: number;
  averageTripDuration: number;
  fuelEfficiency: number;
  maintenanceCosts: number;
  vehicleDowntime: number;
  driverPerformance: Array<{
    driverId: string;
    safetyScore: number;
    efficiencyScore: number;
    complianceScore: number;
  }>;
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
