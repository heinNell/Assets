// src/screens/dashboard/DashboardScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../../contexts/AuthContext";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../constants";
import { MainStackParamList } from "../../navigation/MainNavigator";
import {
  vehicleService,
  analyticsService,
} from "../../services/firebase/firebaseService";
import { FleetAnalytics, Vehicle } from "../../types";

type DashboardScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  "Dashboard"
>;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { userProfile } = useAuth();

  const [analytics, setAnalytics] = useState<FleetAnalytics | null>(null);
  const [recentVehicles, setRecentVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    if (!userProfile?.companyId) return;

    try {
      const [analyticsData, vehiclesData] = await Promise.all([
        analyticsService.getFleetAnalytics(userProfile.companyId),
        vehicleService.getVehiclesByCompany(userProfile.companyId),
      ]);

      setAnalytics(analyticsData);
      setRecentVehicles(vehiclesData.slice(0, 5)); // Show last 5 vehicles
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, [userProfile?.companyId]);

  const navigateToVehicles = () => {
    navigation.navigate("Vehicles");
  };

  const navigateToCheckIn = () => {
    navigation.navigate("CheckIn");
  };

  const navigateToMaintenance = () => {
    navigation.navigate("Maintenance");
  };

  const navigateToMapTest = () => {
    navigation.navigate("MapTest");
  };

  const navigateToTripTracking = () => {
    navigation.navigate("TripTracking");
  };

  const navigateToVehicleDetail = (vehicleId: string) => {
    navigation.navigate("VehicleDetail", { vehicleId });
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }> = ({ title, value, subtitle, color = COLORS.primary }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const VehicleCard: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => (
    <TouchableOpacity
      style={styles.vehicleCard}
      onPress={() => navigateToVehicleDetail(vehicle.id)}
    >
      <View style={styles.vehicleHeader}>
        <Text style={styles.vehicleName}>
          {vehicle.manufacturer} {vehicle.model}
        </Text>
        <Text style={styles.vehiclePlate}>{vehicle.registrationNo}</Text>
      </View>
      <View style={styles.vehicleDetails}>
        <Text style={styles.vehicleMileage}>
          {vehicle.currentMileage?.toLocaleString()} miles
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                vehicle.status === "available"
                  ? COLORS.success
                  : vehicle.status === "in-use"
                  ? COLORS.warning
                  : vehicle.status === "maintenance"
                  ? COLORS.error
                  : COLORS.gray,
            },
          ]}
        >
          <Text style={styles.statusText}>{vehicle.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Welcome back, {userProfile?.firstName || "Driver"}!
          </Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={navigateToCheckIn}
          >
            <Text style={styles.actionIcon}>🚗</Text>
            <Text style={styles.actionText}>Check In Vehicle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={navigateToTripTracking}
          >
            <Text style={styles.actionIcon}>�️</Text>
            <Text style={styles.actionText}>Track Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={navigateToTripHistory}
          >
            <Text style={styles.actionIcon}>�</Text>
            <Text style={styles.actionText}>Trip History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={navigateToVehicles}
          >
            <Text style={styles.actionIcon}>�</Text>
            <Text style={styles.actionText}>View Fleet</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        {analytics && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Fleet Overview</Text>
            <View style={styles.statsGrid}>
              <StatCard
                title="Fleet Utilization"
                value={`${Math.round(analytics.fleetUtilization * 100)}%`}
                color={COLORS.primary}
              />
              <StatCard
                title="Avg Trip Duration"
                value={`${Math.round(analytics.averageTripDuration)}min`}
                subtitle="Average trip time"
                color={COLORS.success}
              />
              <StatCard
                title="Fuel Efficiency"
                value={`${analytics.fuelEfficiency.toFixed(1)}L/100km`}
                subtitle="Average consumption"
                color={COLORS.warning}
              />
              <StatCard
                title="Maintenance Cost"
                value={`R${analytics.maintenanceCosts.toLocaleString()}`}
                color={COLORS.info}
              />
            </View>
          </View>
        )}

        {/* Recent Vehicles */}
        {recentVehicles.length > 0 && (
          <View style={styles.vehiclesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Vehicles</Text>
              <TouchableOpacity onPress={navigateToVehicles}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {recentVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </View>
        )}

        {/* Empty State */}
        {recentVehicles.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🚛</Text>
            <Text style={styles.emptyTitle}>No Vehicles Yet</Text>
            <Text style={styles.emptyText}>
              Vehicles will appear here once they're added to your fleet.
            </Text>
          </View>
        )}
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
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  greeting: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  date: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  quickActions: {
    flexDirection: "row",
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    marginTop: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.md,
  },
  actionIcon: {
    fontSize: FONT_SIZES.xl,
    marginBottom: SPACING.xs,
  },
  actionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  statsSection: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  statTitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  statSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  vehiclesSection: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    marginTop: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: "600",
  },
  vehicleCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  vehicleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  vehicleName: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.text,
  },
  vehiclePlate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  vehicleDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vehicleMileage: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginTop: SPACING.sm,
  },
  emptyIcon: {
    fontSize: FONT_SIZES.xxxl,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

export default DashboardScreen;
