// src/navigation/MainNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { COLORS, SPACING } from "../constants";
import { Ionicons } from "@expo/vector-icons";

// Import screens
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import VehiclesScreen from "../screens/vehicles/VehiclesScreen";
import VehicleDetailScreen from "../screens/vehicles/VehicleDetailScreen";
import CheckInScreen from "../screens/checkin/CheckInScreen";
import MaintenanceScreen from "../screens/maintenance/MaintenanceScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

export type MainStackParamList = {
  Dashboard: undefined;
  Vehicles: undefined;
  VehicleDetail: { vehicleId: string };
  CheckIn: { vehicleId?: string; qrData?: string };
  Maintenance: undefined;
  Profile: undefined;
};

export type TabParamList = {
  DashboardTab: undefined;
  VehiclesTab: undefined;
  CheckInTab: undefined;
  MaintenanceTab: undefined;
  ProfileTab: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Dashboard Stack
const DashboardStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
};

// Vehicles Stack
const VehiclesStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Vehicles" component={VehiclesScreen} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
    </Stack.Navigator>
  );
};

// Check-in Stack
const CheckInStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CheckIn" component={CheckInScreen} />
    </Stack.Navigator>
  );
};

// Maintenance Stack
const MaintenanceStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Maintenance" component={MaintenanceScreen} />
    </Stack.Navigator>
  );
};

// Profile Stack
const ProfileStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "DashboardTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "VehiclesTab") {
            iconName = focused ? "car" : "car-outline";
          } else if (route.name === "CheckInTab") {
            iconName = focused ? "qr-code" : "qr-code-outline";
          } else if (route.name === "MaintenanceTab") {
            iconName = focused ? "build" : "build-outline";
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "help-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.lightGray,
          paddingBottom: SPACING.xs,
          paddingTop: SPACING.xs,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          title: "Dashboard",
        }}
      />
      <Tab.Screen
        name="VehiclesTab"
        component={VehiclesStack}
        options={{
          title: "Vehicles",
        }}
      />
      <Tab.Screen
        name="CheckInTab"
        component={CheckInStack}
        options={{
          title: "Check In",
        }}
      />
      <Tab.Screen
        name="MaintenanceTab"
        component={MaintenanceStack}
        options={{
          title: "Maintenance",
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
