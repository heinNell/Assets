// src/screens/TripDetailsScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import MapViewComponent from "../components/MapView";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../constants";
import { MainStackParamList } from "../navigation/MainNavigator";
import { LocationApiService } from "../services/api/locationApi";
import { TripData, LocationData } from "../types";

type TripDetailsScreenRouteProp = RouteProp<MainStackParamList, "TripDetails">;
type TripDetailsScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  "TripDetails"
>;

const TripDetailsScreen: React.FC = () => {
  const route = useRoute<TripDetailsScreenRouteProp>();
  const navigation = useNavigation<TripDetailsScreenNavigationProp>();
  const { tripId } = route.params;

  const [tripData, setTripData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTripData();
  }, [tripId]);

  const loadTripData = async () => {
    try {
      setLoading(true);

      // Subscribe to trip updates (in case it's still active)
      const unsubscribe = LocationApiService.subscribeToTripUpdates(
        tripId,
        (trip) => {
          if (trip) {
            setTripData(trip);
          }
          setLoading(false);
        }
      );

      // Also try to get the trip data directly
      // This is a fallback in case the subscription doesn't work immediately
      setTimeout(async () => {
        if (!tripData) {
          try {
            // We would need to add a method to get trip by ID
            // For now, we'll rely on the subscription
          } catch (error) {
            console.error("Error loading trip data:", error);
          }
        }
      }, 2000);

      return unsubscribe;
    } catch (error) {
      console.error("Error loading trip data:", error);
      setLoading(false);
      return () => {}; // Return empty unsubscribe function
    }
  };

  const formatDuration = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "N/A";

    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleString();
  };

  const getTripRoute = (): LocationData[] => {
    if (!tripData?.locations) return [];

    // Return locations for map display
    return tripData.locations;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading trip details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!tripData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Trip Not Found</Text>
          <Text style={styles.errorText}>
            The requested trip could not be found or has been deleted.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const routeLocations = getTripRoute();
  const startLocation = routeLocations[0];
  const endLocation = routeLocations[routeLocations.length - 1];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Trip Details</Text>
          <Text style={styles.tripId}>ID: {tripData.id}</Text>
        </View>

        {/* Map View */}
        {routeLocations.length > 0 && (
          <View style={styles.mapContainer}>
            <MapViewComponent
              latitude={startLocation?.latitude || 0}
              longitude={startLocation?.longitude || 0}
              zoomLevel={0.01}
              markers={routeLocations.map((location, index) => ({
                id: `location-${index}`,
                latitude: location.latitude,
                longitude: location.longitude,
                title:
                  index === 0
                    ? "Start"
                    : index === routeLocations.length - 1
                    ? "End"
                    : `Point ${index + 1}`,
                description: formatDate(location.timestamp),
              }))}
              style={styles.map}
            />
          </View>
        )}

        {/* Trip Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Trip Summary</Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Status</Text>
              <Text
                style={[
                  styles.summaryValue,
                  {
                    color:
                      tripData.status === "completed"
                        ? COLORS.success
                        : COLORS.warning,
                  },
                ]}
              >
                {tripData.status}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Distance</Text>
              <Text style={styles.summaryValue}>
                {tripData.totalDistance?.toFixed(2)} km
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg Speed</Text>
              <Text style={styles.summaryValue}>
                {tripData.averageSpeed?.toFixed(1)} km/h
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>
                {formatDuration(tripData.duration || 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Trip Timeline */}
        <View style={styles.timelineContainer}>
          <Text style={styles.sectionTitle}>Trip Timeline</Text>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Trip Started</Text>
              <Text style={styles.timelineTime}>
                {formatDate(tripData.startTime)}
              </Text>
              {startLocation && (
                <Text style={styles.timelineLocation}>
                  {startLocation.latitude.toFixed(6)},{" "}
                  {startLocation.longitude.toFixed(6)}
                </Text>
              )}
            </View>
          </View>

          {tripData.endTime && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.endDot]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Trip Ended</Text>
                <Text style={styles.timelineTime}>
                  {formatDate(tripData.endTime)}
                </Text>
                {endLocation && (
                  <Text style={styles.timelineLocation}>
                    {endLocation.latitude.toFixed(6)},{" "}
                    {endLocation.longitude.toFixed(6)}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Location Points */}
        {routeLocations.length > 2 && (
          <View style={styles.pointsContainer}>
            <Text style={styles.sectionTitle}>
              Route Points ({routeLocations.length})
            </Text>
            <Text style={styles.pointsText}>
              Trip recorded {routeLocations.length} location points
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => {
              // TODO: Implement trip sharing
              console.log("Share trip:", tripData.id);
            }}
          >
            <Text style={styles.shareButtonText}>Share Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  errorTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  errorText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.lg,
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
  tripId: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontFamily: "monospace",
  },
  mapContainer: {
    height: 250,
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
  summaryContainer: {
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
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  summaryItem: {
    width: "50%",
    marginBottom: SPACING.md,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  timelineContainer: {
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
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.md,
    marginTop: 6,
  },
  endDot: {
    backgroundColor: COLORS.success,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  timelineTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  timelineLocation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontFamily: "monospace",
  },
  pointsContainer: {
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
  pointsText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  actionsContainer: {
    margin: SPACING.lg,
    gap: SPACING.md,
  },
  shareButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
  },
  shareButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
});

export default TripDetailsScreen;
