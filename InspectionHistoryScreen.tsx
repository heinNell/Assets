////InspectionHistoryScreen.tsx



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface InspectionRecord {
  id: string;
  vehicleId: string;
  type: 'check_in' | 'check_out' | 'periodic';
  timestamp: Date;
  status: 'completed' | 'in_progress' | 'requires_attention';
  overallCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
}

export const InspectionHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);

  useEffect(() => {
    loadInspectionHistory();
  }, []);

  const loadInspectionHistory = async () => {
    setLoading(true);
    try {
      // Load inspection history from Firebase
      // For now, using placeholder data
      const mockInspections: InspectionRecord[] = [
        {
          id: '1',
          vehicleId: 'AFG7557',
          type: 'check_in',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'completed',
          overallCondition: 'good'
        },
        {
          id: '2',
          vehicleId: 'AFG7557',
          type: 'check_out',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
export default InspectionHistoryScreen;
