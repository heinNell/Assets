import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Share,
  Image,
  Modal,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/MainStack';
import { useAuth } from '../../contexts/AuthContext';
import { useFirebase } from '../../contexts/FirebaseContext';
import { BarcodeService, VehicleBarcode } from '../../services/BarcodeService';
import { Vehicle } from '../../types';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

type VehicleQRManagerNavigationProp = StackNavigationProp<MainStackParamList>;

const { width } = Dimensions.get('window');

interface VehicleQRCardProps {
  vehicle: Vehicle;
  barcode: VehicleBarcode | null;
  onGenerateQR: (vehicle: Vehicle) => void;
  onViewQR: (vehicle: Vehicle, barcode: VehicleBarcode) => void;
  onPrintLabel: (vehicle: Vehicle, barcode: VehicleBarcode) => void;
  onShareQR: (vehicle: Vehicle, barcode: VehicleBarcode) => void;
}

const VehicleQRCard: React.FC<VehicleQRCardProps> = ({
  vehicle,
  barcode,
  onGenerateQR,
  onViewQR,
  onPrintLabel,
  onShareQR
}) => {
  return (
    <View style={styles.vehicleCard}>
      <View style={styles.vehicleHeader}>
        <View style={styles.vehicleInfo}>
          <Text style={styles.licensePlate}>{vehicle.licensePlate}</Text>
          <Text style={styles.vehicleModel}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>
          <Text style={styles.fleetId}>Fleet ID: {vehicle.id}</Text>
        </View>
        
        <View style={styles.qrStatus}>
          {barcode ? (
            <View style={styles.qrActive}>
              <Ionicons name="qr-code" size={24} color="#34C759" />
              <Text style={styles.qrStatusText}>QR Active</Text>
            </View>
          ) : (
            <View style={styles.qrInactive}>
              <Ionicons name="qr-code-outline" size={24} color="#FF9500" />
              <Text style={styles.qrStatusText}>No QR Code</Text>
            </View>
          )}
        </View>
      </View>

      {barcode && (
        <View style={styles.qrPreview}>
          <Image source={{ uri: barcode.qrCodeUrl }} style={styles.qrCodeSmall} />
          <View style={styles.qrDetails}>
            <Text style={styles.qrId}>ID: {barcode.barcodeData.slice(-8)}</Text>
            <Text style={styles.qrCreated}>
              Created: {barcode.createdAt.toLocaleDateString()}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.cardActions}>
        {barcode ? (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onViewQR(vehicle, barcode)}
            >
              <Ionicons name="eye" size={16} color="#007AFF" />
              <Text style={styles.actionButtonText}>View</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onPrintLabel(vehicle, barcode)}
            >
              <Ionicons name="print" size={16} color="#007AFF" />
              <Text style={styles.actionButtonText}>Print</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onShareQR(vehicle, barcode)}
            >
              <Ionicons name="share" size={16} color="#007AFF" />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => onGenerateQR(vehicle)}
          >
            <Ionicons name="add-circle" size={16} color="#fff" />
            <Text style={styles.generateButtonText}>Generate QR Code</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

interface QRViewModalProps {
  visible: boolean;
  vehicle: Vehicle | null;
  barcode: VehicleBarcode | null;
  onClose: () => void;
  onPrint: () => void;
  onShare: () => void;
}

const QRViewModal: React.FC<QRViewModalProps> = ({
  visible,
  vehicle,
  barcode,
  onClose,
  onPrint,
  onShare
}) => {
  if (!vehicle || !barcode) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.qrModal}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Vehicle QR Code</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* QR Code Display */}
          <View style={styles.qrDisplay}>
            <Text style={styles.vehicleTitle}>{vehicle.licensePlate}</Text>
            <Text style={styles.vehicleSubtitle}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Text>
            
            <Image source={{ uri: barcode.qrCodeUrl }} style={styles.qrCodeLarge} />
            
            <Text style={styles.qrInstructions}>
              Drivers should scan this QR code to activate the vehicle
            </Text>
            
            <View style={styles.qrMetadata}>
              <Text style={styles.qrDataText}>Code: {barcode.barcodeData.slice(-12)}</Text>
              <Text style={styles.qrDataText}>
                Generated: {barcode.createdAt.toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.printButton} onPress={onPrint}>
              <Ionicons name="print" size={20} color="#fff" />
              <Text style={styles.printButtonText}>Print Label</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareButton} onPress={onShare}>
              <Ionicons name="share" size={20} color="#007AFF" />
              <Text style={styles.shareButtonText}>Share QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const VehicleQRManagerScreen: React.FC = () => {
  const navigation = useNavigation<VehicleQRManagerNavigationProp>();
  const { userProfile } = useAuth();
  const { getVehicles } = useFirebase();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [barcodes, setBarcodes] = useState<Record<string, VehicleBarcode>>({});
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedBarcode, setSelectedBarcode] = useState<VehicleBarcode | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    loadVehiclesAndBarcodes();
  }, []);

  const loadVehiclesAndBarcodes = async () => {
    if (!userProfile?.companyId) return;

    try {
      setLoading(true);
      const vehiclesList = await getVehicles(userProfile.companyId);
      setVehicles(vehiclesList);

      // Load barcodes for each vehicle
      const barcodePromises = vehiclesList.map(async (vehicle) => {
        const barcode = await BarcodeService.getBarcodeByVehicleId(vehicle.id);
        return { vehicleId: vehicle.id, barcode };
      });

      const barcodeResults = await Promise.all(barcodePromises);
      const barcodesMap: Record<string, VehicleBarcode> = {};
      
      barcodeResults.forEach(({ vehicleId, barcode }) => {
        if (barcode) {
          barcodesMap[vehicleId] = barcode;
        }
      });

      setBarcodes(barcodesMap);
    } catch (error) {
      console.error('Error loading vehicles and barcodes:', error);
      Alert.alert('Error', 'Failed to load vehicle data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async (vehicle: Vehicle) => {
    try {
      setLoading(true);
      const barcode = await BarcodeService.createVehicleBarcode(vehicle);
      setBarcodes(prev => ({ ...prev, [vehicle.id]: barcode }));
      
      Alert.alert(
        'QR Code Generated',
        `QR code successfully created for ${vehicle.licensePlate}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error generating QR code:', error);
      Alert.alert('Error', 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleViewQR = (vehicle: Vehicle, barcode: VehicleBarcode) => {
    setSelectedVehicle(vehicle);
    setSelectedBarcode(barcode);
    setShowQRModal(true);
  };

  const handlePrintLabel = async (vehicle: Vehicle, barcode: VehicleBarcode) => {
    try {
      const labelData = BarcodeService.generatePrintableLabelData(vehicle, barcode);
      
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .label { 
                width: 300px; 
                border: 2px solid #333; 
                padding: 20px; 
                text-align: center;
                page-break-inside: avoid;
              }
              .title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
              .subtitle { font-size: 24px; font-weight: bold; margin-bottom: 15px; }
              .qr-code { margin: 15px 0; }
              .qr-code img { width: 150px; height: 150px; }
              .info { font-size: 12px; margin: 5px 0; text-align: left; }
              .instructions { font-size: 10px; margin-top: 15px; text-align: left; }
              .instructions li { margin: 2px 0; }
            </style>
          </head>
          <body>
            <div class="label">
              <div class="title">${labelData.title}</div>
              <div class="subtitle">${labelData.subtitle}</div>
              <div class="qr-code">
                <img src="${labelData.qrCodeUrl}" alt="QR Code" />
              </div>
              <div class="vehicle-info">
                ${labelData.vehicleInfo.map(info => `<div class="info">${info}</div>`).join('')}
              </div>
              <div class="instructions">
                <strong>How to use:</strong>
                <ol>
                  ${labelData.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                </ol>
              </div>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Success', 'Label generated successfully');
      }
    } catch (error) {
      console.error('Error printing label:', error);
      Alert.alert('Error', 'Failed to generate printable label');
    }
  };

  const handleShareQR = async (vehicle: Vehicle, barcode: VehicleBarcode) => {
    try {
      await Share.share({
        title: `QR Code for ${vehicle.licensePlate}`,
        message: `QR Code for vehicle ${vehicle.licensePlate} (${vehicle.make} ${vehicle.model})\n\nScan this code with the Fleet Tracker app to check-in to this vehicle.\n\nCode: ${barcode.barcodeData}`,
        url: barcode.qrCodeUrl,
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  const handleGenerateAllQRCodes = async () => {
    const vehiclesWithoutQR = vehicles.filter(v => !barcodes[v.id]);
    
    if (vehiclesWithoutQR.length === 0) {
      Alert.alert('Info', 'All vehicles already have QR codes');
      return;
    }

    Alert.alert(
      'Generate All QR Codes',
      `Generate QR codes for ${vehiclesWithoutQR.length} vehicles?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Generate',
          onPress: async () => {
            setLoading(true);
            try {
              const barcodePromises = vehiclesWithoutQR.map(vehicle => 
                BarcodeService.createVehicleBarcode(vehicle)
              );
              
              const newBarcodes = await Promise.all(barcodePromises);
              
              const updatedBarcodes = { ...barcodes };
              newBarcodes.forEach(barcode => {
                updatedBarcodes[barcode.vehicleId] = barcode;
              });
              
              setBarcodes(updatedBarcodes);
              Alert.alert('Success', `Generated QR codes for ${newBarcodes.length} vehicles`);
            } catch (error) {
              console.error('Error generating QR codes:', error);
              Alert.alert('Error', 'Failed to generate some QR codes');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (!userProfile || userProfile.role === 'driver') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.accessDenied}>
          <Ionicons name="shield-outline" size={64} color="#FF3B30" />
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedText}>
            Only managers and administrators can access QR code management
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vehicle QR Codes</Text>
        <TouchableOpacity
          style={styles.generateAllButton}
          onPress={handleGenerateAllQRCodes}
        >
          <Ionicons name="qr-code" size={20} color="#fff" />
          <Text style={styles.generateAllButtonText}>Generate All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{vehicles.length}</Text>
            <Text style={styles.statLabel}>Total Vehicles</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{Object.keys(barcodes).length}</Text>
            <Text style={styles.statLabel}>QR Codes Generated</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {vehicles.length - Object.keys(barcodes).length}
            </Text>
            <Text style={styles.statLabel}>Pending QR Codes</Text>
          </View>
        </View>

        <View style={styles.vehiclesList}>
          {vehicles.map((vehicle) => (
            <VehicleQRCard
              key={vehicle.id}
              vehicle={vehicle}
              barcode={barcodes[vehicle.id] || null}
              onGenerateQR={handleGenerateQR}
              onViewQR={handleViewQR}
              onPrintLabel={handlePrintLabel}
              onShareQR={handleShareQR}
            />
          ))}
        </View>
      </ScrollView>

      <QRViewModal
        visible={showQRModal}
        vehicle={selectedVehicle}
        barcode={selectedBarcode}
        onClose={() => setShowQRModal(false)}
        onPrint={() => {
          if (selectedVehicle && selectedBarcode) {
            handlePrintLabel(selectedVehicle, selectedBarcode);
          }
        }}
        onShare={() => {
          if (selectedVehicle && selectedBarcode) {
            handleShareQR(selectedVehicle, selectedBarcode);
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  generateAllButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  generateAllButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  vehiclesList: {
    padding: 20,
    gap: 16,
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  licensePlate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  vehicleModel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  fleetId: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    fontFamily: 'monospace',
  },
  qrStatus: {
    alignItems: 'flex-end',
  },
  qrActive: {
    alignItems: 'center',
  },
  qrInactive: {
    alignItems: 'center',
  },
  qrStatusText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  qrPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  qrCodeSmall: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  qrDetails: {
    flex: 1,
  },
  qrId: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  qrCreated: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 6,
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  generateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  accessDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginTop: 16,
    marginBottom: 8,
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
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
  qrDisplay: {
    alignItems: 'center',
    padding: 30,
  },
  vehicleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  vehicleSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  qrCodeLarge: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  qrInstructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  qrMetadata: {
    alignItems: 'center',
  },
  qrDataText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  printButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  printButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 8,
  },
  shareButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
