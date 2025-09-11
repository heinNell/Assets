// src/screens/checkin/CheckInScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BarcodeScanResult } from "../../types";
import { MainStackParamList } from "../../navigation/MainStack";
import QRScanner from "../../components/QRScanner";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../../constants";

type CheckInScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  "CheckIn"
>;

const CheckInScreen: React.FC = () => {
  const navigation = useNavigation<CheckInScreenNavigationProp>();
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleQRScan = (result: BarcodeScanResult) => {
    if (!result.success || !result.barcodeData) {
      Alert.alert("Scan Error", result.error || "Failed to scan QR code");
      return;
    }

    try {
      // Parse QR code data (format: FLEET_{REGISTRATION}_{FLEETNO}_{TIMESTAMP}_{RANDOM})
      const parts = result.barcodeData.split("_");
      if (parts[0] !== "FLEET") {
        Alert.alert(
          "Invalid QR Code",
          "This QR code is not a valid vehicle code."
        );
        return;
      }

      const vehicleReg = parts[1];
      const fleetNo = parts[2];

      setScannedData(result.barcodeData);
      setShowScanner(false);

      Alert.alert(
        "Vehicle Found",
        `Vehicle: ${vehicleReg}
Fleet No: ${fleetNo}`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Proceed to Check-in",
            onPress: () => {
              // Navigate to check-in form with vehicle data
              console.log("Proceeding to check-in for vehicle:", vehicleReg);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to parse QR code data.");
    }
  };

  const handleManualEntry = () => {
    Alert.alert("Manual Entry", "Manual vehicle entry feature coming soon!");
  };

  if (showScanner) {
    return (
      <QRScanner
        onScan={handleQRScan}
        onClose={() => setShowScanner(false)}
        title="Scan Vehicle QR Code"
        subtitle="Point your camera at the vehicle QR code to check in"
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Vehicle Check-In</Text>
        <Text style={styles.subtitle}>
          Scan the vehicle QR code or enter details manually
        </Text>

        <View style={styles.options}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setShowScanner(true)}
          >
            <Text style={styles.optionIcon}>📱</Text>
            <Text style={styles.optionTitle}>Scan QR Code</Text>
            <Text style={styles.optionDescription}>
              Use camera to scan vehicle QR code
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleManualEntry}
          >
            <Text style={styles.optionIcon}>✏️</Text>
            <Text style={styles.optionTitle}>Manual Entry</Text>
            <Text style={styles.optionDescription}>
              Enter vehicle details manually
            </Text>
          </TouchableOpacity>
        </View>

        {scannedData && (
          <View style={styles.scannedData}>
            <Text style={styles.scannedTitle}>Last Scanned:</Text>
            <Text style={styles.scannedValue}>{scannedData}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  options: {
    gap: SPACING.lg,
  },
  optionButton: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionIcon: {
    fontSize: FONT_SIZES.xxxl,
    marginBottom: SPACING.md,
  },
  optionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  optionDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  scannedData: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  scannedTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  scannedValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontFamily: "monospace",
  },
});

export default CheckInScreen;
