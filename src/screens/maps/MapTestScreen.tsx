// src/screens/MapTestScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../constants";
import MapViewComponent from "../components/MapView";
import { LocationService } from "../services/LocationService";
import { LocationData } from "../types";

const MapTestScreen: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [isTracking, setIsTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);

  const handleGetCurrentLocation = async () => {
    const location = await LocationService.getCurrentLocation();
    if (location) {
      setCurrentLocation(location);
      Alert.alert(
        "Location Found",
        `Lat: ${location.latitude.toFixed(
          6
        )}\nLng: ${location.longitude.toFixed(6)}`
      );
    } else {
      Alert.alert("Error", "Could not get current location");
    }
  };

  const handleStartTracking = async () => {
    const success = await LocationService.startLocationTracking(
      (location) => {
        setCurrentLocation(location);
        setLocationHistory((prev) => [...prev.slice(-9), location]); // Keep last 10 locations
      },
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // 5 seconds
        distanceInterval: 10, // 10 meters
      }
    );

    if (success) {
      setIsTracking(true);
      Alert.alert("Tracking Started", "Location tracking is now active");
    } else {
      Alert.alert("Error", "Could not start location tracking");
    }
  };

  const handleStopTracking = async () => {
    await LocationService.stopLocationTracking();
    setIsTracking(false);
    Alert.alert("Tracking Stopped", "Location tracking has been stopped");
  };

  const markers = [
    ...(currentLocation
      ? [
          {
            id: "current",
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            title: "Current Location",
            description: `Accuracy: ${currentLocation.accuracy?.toFixed(1)}m`,
          },
        ]
      : []),
    ...locationHistory.slice(-5).map((location, index) => ({
      id: `history-${index}`,
      latitude: location.latitude,
      longitude: location.longitude,
      title: `Point ${index + 1}`,
      description: new Date(location.timestamp).toLocaleTimeString(),
    })),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Map Test</Text>
        <Text style={styles.subtitle}>Test Google Maps integration</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapViewComponent
          latitude={currentLocation?.latitude || 37.78825}
          longitude={currentLocation?.longitude || -122.4324}
          zoomLevel={0.01}
          markers={markers}
          style={styles.map}
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetCurrentLocation}
        >
          <Text style={styles.buttonText}>📍 Get Location</Text>
        </TouchableOpacity>

        {!isTracking ? (
          <TouchableOpacity
            style={[styles.button, styles.trackingButton]}
            onPress={handleStartTracking}
          >
            <Text style={styles.buttonText}>▶️ Start Tracking</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={handleStopTracking}
          >
            <Text style={styles.buttonText}>⏹️ Stop Tracking</Text>
          </TouchableOpacity>
        )}
      </View>

      {currentLocation && (
        <View style={styles.locationInfo}>
          <Text style={styles.infoTitle}>Current Location:</Text>
          <Text style={styles.infoText}>
            Lat: {currentLocation.latitude.toFixed(6)}
          </Text>
          <Text style={styles.infoText}>
            Lng: {currentLocation.longitude.toFixed(6)}
          </Text>
          <Text style={styles.infoText}>
            Accuracy: {currentLocation.accuracy?.toFixed(1)}m
          </Text>
          {currentLocation.speed && (
            <Text style={styles.infoText}>
              Speed: {(currentLocation.speed * 3.6).toFixed(1)} km/h
            </Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.xs,
  },
  mapContainer: {
    flex: 1,
    margin: SPACING.md,
  },
  map: {
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
  },
  controls: {
    flexDirection: "row",
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
  },
  trackingButton: {
    backgroundColor: COLORS.success,
  },
  stopButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
  locationInfo: {
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  infoTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontFamily: "monospace",
  },
});

export default MapTestScreen;
