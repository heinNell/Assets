// src/screens/profile/ProfileScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../constants";

const ProfileScreen: React.FC = () => {
  const { userProfile, signOut, loading } = useAuth();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  const ProfileItem: React.FC<{ label: string; value: string }> = ({
    label,
    value,
  }) => (
    <View style={styles.profileItem}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userProfile?.firstName?.[0]}
              {userProfile?.lastName?.[0]}
            </Text>
          </View>
          <Text style={styles.name}>
            {userProfile?.firstName} {userProfile?.lastName}
          </Text>
          <Text style={styles.role}>
            {userProfile?.role?.charAt(0).toUpperCase() +
              userProfile?.role?.slice(1)}
          </Text>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>

          <ProfileItem
            label="Email"
            value={userProfile?.email || "Not provided"}
          />

          <ProfileItem
            label="Phone"
            value={userProfile?.phoneNumber || "Not provided"}
          />

          <ProfileItem
            label="Driver License"
            value={userProfile?.driverLicense || "Not provided"}
          />

          <ProfileItem
            label="Company ID"
            value={userProfile?.companyId || "Not provided"}
          />
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Notification Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <View style={styles.signOutSection}>
          <TouchableOpacity
            style={[
              styles.signOutButton,
              loading && styles.signOutButtonDisabled,
            ]}
            onPress={handleSignOut}
            disabled={loading}
          >
            <Text style={styles.signOutButtonText}>
              {loading ? "Signing Out..." : "Sign Out"}
            </Text>
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
  header: {
    alignItems: "center",
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
    color: COLORS.white,
  },
  name: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  role: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.sm,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  profileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  itemLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  itemValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: "600",
  },
  actionButton: {
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: "600",
  },
  signOutSection: {
    padding: SPACING.lg,
    marginTop: SPACING.sm,
  },
  signOutButton: {
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
  },
  signOutButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  signOutButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    fontWeight: "600",
  },
});

export default ProfileScreen;
