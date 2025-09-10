//VehiclesScreen.tsx


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TextInput
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface VehicleItem {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_service';
  currentOdometer: number;
  fuelLevel?: number;
}

export const VehiclesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleItem[]>([]);

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [searchQuery, vehicles]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      // Load vehicles from Firebase
      // For now, using placeholder data
      const mockVehicles: VehicleItem[] = [
        {
          id: 'AFG7557',
          make: 'HONDA',
          model: 'FIT RS',
          year: 2020,
          licensePlate: 'AFG7557',
export default VehiclesScreen;
