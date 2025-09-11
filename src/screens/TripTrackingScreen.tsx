// src/screens/TripTrackingScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../constants";
import { MainStackParamList } from "../navigation/MainNavigator";
import MapViewComponent from "../components/MapView";
import { LocationTrackingService } from "../services/api/locationTrackingService";
import { LocationApiService } from "../services/api/locationApi";
import { LocationData, TripData } from "../types";

type TripTrackingScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  "TripTracking"
>;

const TripTrackingScreen: React.FC = () => {
  const navigation = useNavigation<TripTrackingScreenNavigationProp>();
  const { userProfile } = useAuth();

  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    checkPermissionsAndStatus();
  }, []);

  const checkPermissionsAndStatus = async (): Promise<void> => {
    try {
      // Check location permissions
      const permissions = await LocationTrackingService.checkPermissions();
      setPermissionsGranted(permissions.foreground);

      if (!permissions.foreground) {
        Alert.alert(
          "Location Permission Required",
          "Location permission is required to track your trip. Please grant permission in settings.",
          [{ text: "OK" }]
        );
        return;
      }

      // Check if there's an active trip
      if (userProfile?.uid) {
        const status = await LocationTrackingService.getTripStatus(
          userProfile.uid
        );
        setIsTracking(status.isActive);
        setTripData(status.tripData);

        if (status.isActive && status.tripId) {
          // Subscribe to trip updates
          const unsubscribe = LocationApiService.subscribeToTripUpdates(
            status.tripId,
            (updatedTrip) => {
              setTripData(updatedTrip);
            }
          );

          // Store unsubscribe function for cleanup
          return;
        }
      }

      // Get current location
      const location = await LocationTrackingService.getCurrentLocation();
      setCurrentLocation(location);
    } catch (error) {
      console.error("Error checking status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrip = async () => {
    if (!userProfile?.uid) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, using a placeholder vehicle ID
      // In real app, this would come from QR scan or vehicle selection
      const vehicleId = "demo-vehicle-id";

      const tripId = await LocationTrackingService.startTripTracking(
        userProfile.uid,
        vehicleId
      );

      if (tripId) {
        setIsTracking(true);
        Alert.alert("Success", "Trip tracking started successfully!");
      } else {
        Alert.alert("Error", "Failed to start trip tracking");
      }
    } catch (error) {
      console.error("Error starting trip:", error);
      Alert.alert("Error", "Failed to start trip tracking");
    } finally {
      setLoading(false);
    }
  };

  const handleStopTrip = async () => {
    Alert.alert("End Trip", "Are you sure you want to end the current trip?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Trip",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            const finalTripData =
              await LocationTrackingService.stopTripTracking();

            if (finalTripData) {
              setIsTracking(false);
              setTripData(finalTripData);

              Alert.alert(
                "Trip Completed",
                `Trip completed successfully!\nDistance: ${finalTripData.totalDistance?.toFixed(
                  2
                )} km\nDuration: ${Math.round(
                  (finalTripData.duration || 0) / (1000 * 60)
                )} minutes`,
                [
                  {
                    text: "View Details",
                    onPress: () =>
                      navigation.navigate("TripDetails", {
                        tripId: finalTripData.id,
                      }),
                  },
                  { text: "OK" },
                ]
              );
            } else {
              Alert.alert("Error", "Failed to end trip");
            }
          } catch (error) {
            console.error("Error stopping trip:", error);
            Alert.alert("Error", "Failed to end trip");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleRequestPermissions = async () => {
    const granted = await LocationTrackingService.requestPermissions();
    setPermissionsGranted(granted);

    if (granted) {
      Alert.alert("Success", "Location permissions granted!");
      checkPermissionsAndStatus();
    } else {
      Alert.alert(
        "Permission Denied",
        "Location permissions are required for trip tracking. Please enable them in your device settings."
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading trip tracking...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Trip Tracking</Text>
          <Text style={styles.subtitle}>
            {isTracking ? "Trip in progress" : "Ready to start tracking"}
          </Text>
        </View>

        {/* Map View */}
        <View style={styles.mapContainer}>
          <MapViewComponent
            latitude={currentLocation?.latitude || 37.78825}
            longitude={currentLocation?.longitude || -122.4324}
            zoomLevel={0.01}
            style={styles.map}
          />
        </View>

        {/* Trip Status */}
        {isTracking && tripData && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusTitle}>Current Trip</Text>
            <View style={styles.statusGrid}>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Distance</Text>
                <Text style={styles.statusValue}>
                  {tripData.totalDistance?.toFixed(2)} km
                </Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Avg Speed</Text>
                <Text style={styles.statusValue}>
                  {tripData.averageSpeed?.toFixed(1)} km/h
                </Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Duration</Text>
                <Text style={styles.statusValue}>
                  {Math.round(
                    (Date.now() - (tripData.startTime?.toMillis() || 0)) /
                      (1000 * 60)
                  )}{" "}
                  min
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Permissions Warning */}
        {!permissionsGranted && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningTitle}>
              Location Permission Required
            </Text>
            <Text style={styles.warningText}>
              To track your trips, we need access to your location. This allows
              us to monitor your route and provide accurate trip data.
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={handleRequestPermissions}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        {permissionsGranted && (
          <View style={styles.actionsContainer}>
            {!isTracking ? (
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartTrip}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.startButtonText}>Start Trip</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.stopButton}
                onPress={handleStopTrip}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.stopButtonText}>End Trip</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Trip History */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Recent Trips</Text>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate("TripHistory")}
          >
            <Text style={styles.historyButtonText}>View Trip History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
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
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  mapContainer: {
    height: 300,
    margin: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  map: {
    flex: 1,
  },
  statusContainer: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statusGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusItem: {
    flex: 1,
    alignItems: "center",
  },
  statusLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  statusValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  warningContainer: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.warningLight,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  warningTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.warning,
    marginBottom: SPACING.sm,
  },
  warningText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  permissionButton: {
    backgroundColor: COLORS.warning,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
  },
  permissionButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
  actionsContainer: {
    margin: SPACING.lg,
  },
  startButton: {
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: "center",
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
  },
  stopButton: {
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: "center",
  },
  stopButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
  },
  historyContainer: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  historyButton: {
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
  },
  historyButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
});

export default TripTrackingScreen;
