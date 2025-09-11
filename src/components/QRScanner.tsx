// src/components/QRScanner.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../constants";
import { BarcodeService, BarcodeScanResult } from "../services/BarcodeService";

interface QRScannerProps {
  onScan: (result: BarcodeScanResult) => void;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  driverId?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  onClose,
  title = "Scan Vehicle QR Code",
  subtitle = "Point your camera at a vehicle QR code to start check-in",
  driverId,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async (scanningResult: {
    type: string;
    data: string;
  }) => {
    if (scanned || processing) return;

    setScanned(true);
    setProcessing(true);

    try {
      // Process QR code using BarcodeService
      const scanResult = await BarcodeService.scanVehicleQR(
        scanningResult.data,
        driverId || "unknown-driver"
      );

      onScan(scanResult);
    } catch (error) {
      console.error("Error processing QR code:", error);
      Alert.alert(
        "Scan Error",
        "Failed to process QR code. Please try again.",
        [{ text: "OK", onPress: () => setScanned(false) }]
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setProcessing(false);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.permissionText}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera permission is required to scan QR codes.
        </Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {processing && (
          <View style={styles.processingIndicator}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.processingText}>Processing QR code...</Text>
          </View>
        )}
      </View>

      {/* Scanner */}
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={styles.scanner}
        />

        {/* Scanner overlay */}
        <View style={styles.overlay}>
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.scanArea}>
              <View style={[styles.scanCorner, styles.topLeft]} />
              <View style={[styles.scanCorner, styles.topRight]} />
              <View style={[styles.scanCorner, styles.bottomLeft]} />
              <View style={[styles.scanCorner, styles.bottomRight]} />
            </View>
            <View style={styles.overlaySide} />
          </View>
          <View style={styles.overlayBottom} />
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {scanned && !processing && (
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={handleScanAgain}
          >
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const scanAreaSize = Math.min(width * 0.7, height * 0.4);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  permissionText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    textAlign: "center",
    padding: SPACING.lg,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.black,
  },
  title: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.lightGray,
    fontSize: FONT_SIZES.md,
    textAlign: "center",
  },
  scannerContainer: {
    flex: 1,
    position: "relative",
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTop: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayMiddle: {
    flexDirection: "row",
    height: scanAreaSize,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scanArea: {
    width: scanAreaSize,
    height: scanAreaSize,
    position: "relative",
  },
  scanCorner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  overlayBottom: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  controls: {
    padding: SPACING.lg,
    backgroundColor: COLORS.black,
  },
  scanAgainButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  scanAgainText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: COLORS.gray,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
  processingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.sm,
  },
  processingText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.sm,
  },
});

export default QRScanner;
