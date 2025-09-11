// src/navigation/MainStack.tsx
export type MainStackParamList = {
  Dashboard: undefined;
  Vehicles: undefined;
  VehicleDetail: { vehicleId: string };
  CheckIn: { vehicleId?: string; qrData?: string };
  Maintenance: undefined;
  Profile: undefined;
  TripTracking: undefined;
  TripDetails: { tripId: string };
  TripHistory: undefined;
  MapTest: undefined; // Added for MapTestScreen
};
