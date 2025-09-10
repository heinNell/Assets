////src/screens/scanner/BarcodeScannerScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
  Image,
  ActivityIndicator
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../navigation/MainStack';
import { BarcodeService } from '../../services/BarcodeService';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from '../../contexts/LocationContext';
import { Vehicle, VehicleBarcode } from '../../types';

type BarcodeScannerNavigationProp = StackNavigationProp<MainStackParamList, 'BarcodeScanner'>;
type BarcodeScannerRouteProp = RouteProp<MainStackParamList, 'BarcodeScanner'>;

const { width, height } = Dimensions.get('window');

interface VehicleActivationModalProps {
  visible: boolean;
  vehicle: Vehicle | null;
  barcode: VehicleBarcode | null;
  onActivate: () => void;
  onCancel: () => void;
  loading: boolean;
}

const VehicleActivationModal: React.FC<VehicleActivationModalProps> = ({
  visible,
  vehicle,
  barcode,
  onActivate,
  onCancel,
  loading
}) => {
  if (!vehicle || !barcode) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#34C759';
      case 'in-use': return '#FF9500';
      case 'maintenance': return '#FF3B30';
      case 'out-of-service': return '#8E8E93';
      default: return '#8E8E93';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available for Check-In';
      case 'in-use': return 'Currently In Use';
      case 'maintenance': return 'Under Maintenance';
      case 'out-of-service': return 'Out of Service';
      default: return 'Unknown Status';
    }
  };

  const canActivate = vehicle.status === 'available';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.activationModal}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Vehicle Scanned</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Vehicle Info */}
          <View style={styles.vehicleInfo}>
            <View style={styles.vehicleMainInfo}>
              <Text style={styles.licensePlate}>{vehicle.licensePlate}</Text>
              <Text style={styles.vehicleModel}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </Text>
              <Text style={styles.vehicleDetails}>
                {vehicle.color} • {vehicle.fuelType} • {vehicle.seatingCapacity} seats
              </Text>
            </View>

            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(vehicle.status) }]}>
              <Text style={styles.statusText}>{getStatusText(vehicle.status)}</Text>
            </View>

            {/* Vehicle Specifications */}
            <View style={styles.specsContainer}>
              <View style={styles.specItem}>
                <Ionicons name="speedometer-outline" size={20} color="#666" />
                <Text style={styles.specText}>{vehicle.currentMileage.toLocaleString()} km</Text>
              </View>
              
              <View style={styles.specItem}>
                <Ionicons name="build-outline" size={20} color="#666" />
                <Text style={styles.specText}>
                  Service: {(vehicle.nextServiceDue - vehicle.currentMileage).toLocaleString()} km
                </Text>
              </View>
            </View>

            {/* QR Code Display */}
            {barcode.qrCodeUrl && (
              <View style={styles.qrCodeContainer}>
                <Image source={{ uri: barcode.qrCodeUrl }} style={styles.qrCodeImage} />
                <Text style={styles.barcodeId}>ID: {barcode.barcodeData.slice(-8)}</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            {canActivate ? (
              <TouchableOpacity
                style={[styles.activateButton, loading && styles.activateButtonDisabled]}
                onPress={onActivate}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="log-in" size={20} color="#fff" />
                    <Text style={styles.activateButtonText}>Start Check-In</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.unavailableContainer}>
                <Ionicons name="alert-circle" size={24} color="#FF9500" />
                <Text style={styles.unavailableText}>
                  Vehicle is {vehicle.status === 'in-use' ? 'currently in use' : 'not available'}
                </Text>
                {vehicle.status === 'in-use' && (
                  <TouchableOpacity
                    style={styles.checkOutButton}
                    onPress={() => {
                      onCancel();
                      // Navigate to check-out if this driver is using the vehicle
                    }}
                  >
                    <Text style={styles.checkOutButtonText}>Check Out Instead</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const BarcodeScannerScreen: React.FC = () => {
  const navigation = useNavigation<BarcodeScannerNavigationProp>();
  const route = useRoute<BarcodeScannerRouteProp>();
  const { onScan } = route.params;
  const { userProfile } = useAuth();
  const { getCurrentLocation } = useLocation();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [scannedVehicle, setScannedVehicle] = useState<Vehicle | null>(null);
  const [scannedBarcode, setScannedBarcode] = useState<VehicleBarcode | null>(null);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);

    try {
      // First check if it's a fleet vehicle barcode
      if (BarcodeService.isValidBarcodeFormat(data)) {
        const { vehicle, barcode } = await BarcodeService.findVehicleByBarcode(data);
        
        if (vehicle && barcode) {
          setScannedVehicle(vehicle);
          setScannedBarcode(barcode);
          setShowActivationModal(true);
          return;
        }
      }

      // If not a fleet barcode, use the original callback
      Alert.alert(
        'Code Scanned',
        `Scanned: ${data}`,
        [
          {
            text: 'Scan Again',
            onPress: () => setScanned(false),
            style: 'cancel'
          },
          {
            text: 'Continue',
            onPress: () => {
              onScan(data);
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error processing barcode:', error);
      Alert.alert('Error', 'Failed to process barcode. Please try again.');
      setScanned(false);
    }
  };

  const handleVehicleActivation = async () => {
    if (!scannedVehicle || !userProfile) return;

    setActivating(true);

    try {
      // Get current location for check-in
      const location = await getCurrentLocation();
      
      // Navigate to check-in screen with pre-filled vehicle information
      setShowActivationModal(false);
      setActivating(false);
      
      // Small delay to allow modal to close
      setTimeout(() => {
        navigation.replace('CheckIn', { 
          vehicleId: scannedVehicle.id,
        });
      }, 300);

    } catch (error) {
      console.error('Error activating vehicle:', error);
      Alert.alert('Error', 'Failed to activate vehicle. Please try again.');
      setActivating(false);
    }
  };

  const handleModalCancel = () => {
    setShowActivationModal(false);
    setScannedVehicle(null);
    setScannedBarcode(null);
    setScanned(false);
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color="#666" />
          <Text style={styles.permissionText}>Camera access is required to scan vehicle codes</Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={() => BarCodeScanner.requestPermissionsAsync()}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
        flashMode={flashOn ? 'torch' : 'off'}
        barCodeTypes={[
          BarCodeScanner.Constants.BarCodeType.qr,
          BarCodeScanner.Constants.BarCodeType.ean13,
          BarCodeScanner.Constants.BarCodeType.ean8,
          BarCodeScanner.Constants.BarCodeType.code128,
          BarCodeScanner.Constants.BarCodeType.code39,
          BarCodeScanner.Constants.BarCodeType.code93,
          BarCodeScanner.Constants.BarCodeType.codabar,
          BarCodeScanner.Constants.BarCodeType.datamatrix,
          BarCodeScanner.Constants.BarCodeType.pdf417,
        ]}
      />
      
      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Top overlay */}
        <View style={styles.overlayTop}>
          <Text style={styles.instructionText}>
            🚗 Scan the QR code on your assigned vehicle to activate and check-in
          </Text>
          <Text style={styles.subInstructionText}>
            Position the code within the frame below
          </Text>
        </View>
        
        {/* Scanner frame */}
        <View style={styles.scannerFrame}>
          <View style={styles.scannerArea}>
            {/* Corner markers */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            {/* Scanning line animation */}
            <View style={styles.scanningLine} />
          </View>
        </View>
        
        {/* Bottom overlay */}
        <View style={styles.overlayBottom}>
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleFlash}
            >
              <Ionicons 
                name={flashOn ? "flash" : "flash-outline"} 
                size={24} 
                color="#fff" 
              />
              <Text style={styles.controlText}>Flash</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={24} color="#fff" />
              <Text style={styles.controlText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          {scanned && !showActivationModal && (
            <TouchableOpacity
              style={styles.scanAgainButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Vehicle Activation Modal */}
      <VehicleActivationModal
        visible={showActivationModal}
        vehicle={scannedVehicle}
        barcode={scannedBarcode}
        onActivate={handleVehicleActivation}
        onCancel={handleModalCancel}
        loading={activating}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scanner: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginVertical: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  instructionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '600',
  },
  subInstructionText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  scannerFrame: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerArea: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#007AFF',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanningLine: {
    position: 'absolute',
    top: '50%',
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: '#007AFF',
    opacity: 0.8,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 50,
  },
  controlButton: {
    alignItems: 'center',
    padding: 15,
  },
  controlText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  scanAgainButton: {
    marginTop: 30,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: '#007AFF',
    borderRadius: 25,
  },
  scanAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  activationModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  vehicleInfo: {
    padding: 20,
  },
  vehicleMainInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  licensePlate: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  vehicleModel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#999',
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  specsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrCodeImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  barcodeId: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  modalActions: {
    padding: 20,
    gap: 12,
  },
  activateButton: {
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  activateButtonDisabled: {
    backgroundColor: '#ccc',
  },
  activateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  unavailableContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff9f0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF9500',
  },
  unavailableText: {
    fontSize: 16,
    color: '#FF9500',
    textAlign: 'center',
    marginTop: 8,
  },
  checkOutButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  checkOutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
