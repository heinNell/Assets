// src/constants/index.ts
export const APP_CONFIG = {
  name: "Fleet Tracker",
  version: "1.0.0",
  company: "MAT LMVS",
  supportEmail: "support@matlmvs.com",
  apiUrl: "https://api.matlmvs.com",
};

export const FIREBASE_COLLECTIONS = {
  COMPANIES: "companies",
  USERS: "users",
  VEHICLES: "vehicles",
  VEHICLE_CHECKINS: "vehicleCheckIns",
  CHECK_INS: "vehicleCheckIns", // Alias for compatibility
  MAINTENANCE_RECORDS: "maintenanceRecords",
  MAINTENANCE: "maintenanceRecords", // Alias for compatibility
  VEHICLE_LOCATIONS: "vehicleLocations",
  LOCATION_UPDATES: "vehicleLocations", // Alias for compatibility
  GEOFENCES: "geofences",
  QR_CODES: "qrCodes",
  ANALYTICS: "analytics",
  TRIPS: "trips",
};

export const USER_ROLES = {
  DRIVER: "driver",
  MANAGER: "manager",
  ADMIN: "admin",
} as const;

export const VEHICLE_STATUS = {
  AVAILABLE: "available",
  IN_USE: "in-use",
  MAINTENANCE: "maintenance",
  OUT_OF_SERVICE: "out-of-service",
} as const;

export const MAINTENANCE_TYPES = {
  SCHEDULED: "scheduled",
  UNSCHEDULED: "unscheduled",
  EMERGENCY: "emergency",
} as const;

export const ALERT_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export const GEOFENCE_TYPES = {
  CIRCULAR: "circular",
  POLYGON: "polygon",
} as const;

export const CHECKPOINT_TYPES = {
  START: "start",
  END: "end",
  INSPECTION: "inspection",
} as const;

export const VEHICLE_CONDITION_RATINGS = {
  EXCELLENT: "excellent",
  GOOD: "good",
  FAIR: "fair",
  POOR: "poor",
} as const;

export const ANALYTICS_PERIODS = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
} as const;

export const MAP_CONFIG = {
  DEFAULT_ZOOM: 15,
  MIN_ZOOM: 10,
  MAX_ZOOM: 20,
  DEFAULT_LATITUDE: -26.2041, // Johannesburg
  DEFAULT_LONGITUDE: 28.0473,
};

export const LOCATION_CONFIG = {
  HIGH_ACCURACY: {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 10000,
  },
  BALANCED_ACCURACY: {
    enableHighAccuracy: false,
    timeout: 30000,
    maximumAge: 30000,
  },
};

export const QR_CONFIG = {
  VALIDITY_PERIOD: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  ERROR_CORRECTION: "M", // Medium error correction
  SIZE: 300,
};

export const MAINTENANCE_THRESHOLDS = {
  MILEAGE_ALERT: 5000, // km before service due
  TIME_ALERT: 30, // days before service due
  FUEL_LOW_THRESHOLD: 0.25, // 25% fuel remaining
};

export const API_ENDPOINTS = {
  VEHICLES: "/vehicles",
  CHECKINS: "/checkins",
  MAINTENANCE: "/maintenance",
  ANALYTICS: "/analytics",
  USERS: "/users",
};

export const STORAGE_KEYS = {
  USER_TOKEN: "user_token",
  USER_DATA: "user_data",
  APP_SETTINGS: "app_settings",
  OFFLINE_DATA: "offline_data",
};

export const COLORS = {
  primary: "#1976D2",
  secondary: "#DC004E",
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#2196F3",
  background: "#F5F5F5",
  surface: "#FFFFFF",
  text: "#212121",
  textSecondary: "#757575",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#9E9E9E",
  lightGray: "#E0E0E0",
  warningLight: "#FFF3E0", // Light warning background
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};
