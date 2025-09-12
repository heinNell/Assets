/* eslint-disable no-undef */
// src/utils/expoUtils.js

import {
  Accelerometer,
  Barometer,
  DeviceMotion,
  Gyroscope,
  LightSensor,
  Magnetometer,
  MagnetometerUncalibrated,
  Pedometer,
} from 'expo-sensors';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as ScreenCapture from 'expo-screen-capture';
import * as DocumentPicker from 'expo-document-picker';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// SENSOR UTILITIES
// ============================================================================

export const sensorUtils = {
  /**
   * Check if a specific sensor is available
   */
  async isSensorAvailable(sensorType) {
    try {
      const sensorMap = {
        accelerometer: Accelerometer,
        gyroscope: Gyroscope,
        magnetometer: Magnetometer,
        barometer: Barometer,
        lightSensor: LightSensor,
        deviceMotion: DeviceMotion,
        pedometer: Pedometer,
      };
      
      const sensor = sensorMap[sensorType];
      if (!sensor) {
        throw new Error(`Unknown sensor type: ${sensorType}`);
      }
      
      return await sensor.isAvailableAsync();
    } catch (error) {
      console.error(`Error checking availability for ${sensorType}:`, error);
      return false;
    }
  },

  /**
   * Set update interval for a sensor (respects Android 12+ 200Hz limit)
   */
  setSensorUpdateInterval(sensor, intervalMs) {
    try {
      // Starting from Android 12, there's a 200ms limit for sensor updates
      const minInterval = Platform.OS === 'android' ? Math.max(200, intervalMs) : intervalMs;
      sensor.setUpdateInterval(minInterval);
      return true;
    } catch (error) {
      console.error('Error setting update interval:', error);
      return false;
    }
  },

  /**
   * Subscribe to accelerometer updates with options
   */
  subscribeToAccelerometer(listener, options = {}) {
    const { intervalMs = 100, enableHighSampling = false } = options;
    
    try {
      if (enableHighSampling && Platform.OS === 'android') {
        // Note: Requires HIGH_SAMPLING_RATE_SENSORS permission for < 200Hz
        this.setSensorUpdateInterval(Accelerometer, Math.max(50, intervalMs));
      } else {
        this.setSensorUpdateInterval(Accelerometer, intervalMs);
      }
      
      return Accelerometer.addListener(listener);
    } catch (error) {
      console.error('Error subscribing to accelerometer:', error);
      throw error;
    }
  },

  /**
   * Subscribe to gyroscope updates
   */
  subscribeToGyroscope(listener, intervalMs = 100) {
    try {
      this.setSensorUpdateInterval(Gyroscope, intervalMs);
      return Gyroscope.addListener(listener);
    } catch (error) {
      console.error('Error subscribing to gyroscope:', error);
      throw error;
    }
  },

  /**
   * Subscribe to magnetometer updates (calibrated)
   */
  subscribeToMagnetometer(listener, intervalMs = 100, useUncalibrated = false) {
    try {
      const sensor = useUncalibrated ? MagnetometerUncalibrated : Magnetometer;
      this.setSensorUpdateInterval(sensor, intervalMs);
      return sensor.addListener(listener);
    } catch (error) {
      console.error('Error subscribing to magnetometer:', error);
      throw error;
    }
  },

  /**
   * Subscribe to device motion updates with full sensor data
   */
  subscribeToDeviceMotion(listener, intervalMs = 100) {
    try {
      this.setSensorUpdateInterval(DeviceMotion, intervalMs);
      return DeviceMotion.addListener((data) => {
        // Enhanced data with calculated values
        const enhancedData = {
          ...data,
          // Calculate total acceleration magnitude
          totalAcceleration: data.acceleration ? 
            Math.sqrt(
              Math.pow(data.acceleration.x, 2) + 
              Math.pow(data.acceleration.y, 2) + 
              Math.pow(data.acceleration.z, 2)
            ) : null,
          // Calculate device tilt
          tilt: data.rotation ? {
            pitch: data.rotation.beta,
            roll: data.rotation.gamma,
            yaw: data.rotation.alpha
          } : null
        };
        listener(enhancedData);
      });
    } catch (error) {
      console.error('Error subscribing to device motion:', error);
      throw error;
    }
  },

  /**
   * Subscribe to barometer updates
   */
  subscribeToBarometer(listener, intervalMs = 1000) {
    try {
      this.setSensorUpdateInterval(Barometer, intervalMs);
      return Barometer.addListener((data) => {
        // Enhanced data with altitude estimation
        const enhancedData = {
          ...data,
          // Estimate altitude from pressure (rough approximation)
          estimatedAltitude: data.pressure ? 
            44330 * (1 - Math.pow(data.pressure / 1013.25, 0.1903)) : null
        };
        listener(enhancedData);
      });
    } catch (error) {
      console.error('Error subscribing to barometer:', error);
      throw error;
    }
  },

  /**
   * Subscribe to light sensor updates
   */
  subscribeToLightSensor(listener, intervalMs = 500) {
    try {
      this.setSensorUpdateInterval(LightSensor, intervalMs);
      return LightSensor.addListener((data) => {
        // Enhanced data with light level categories
        const enhancedData = {
          ...data,
          lightLevel: this.categorizeLightLevel(data.illuminance)
        };
        listener(enhancedData);
      });
    } catch (error) {
      console.error('Error subscribing to light sensor:', error);
      throw error;
    }
  },

  /**
   * Subscribe to pedometer updates
   */
  async subscribeToPedometer(listener) {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Pedometer is not available on this device');
      }
      return Pedometer.watchStepCount(listener);
    } catch (error) {
      console.error('Error subscribing to pedometer:', error);
      throw error;
    }
  },

  /**
   * Get pedometer history data
   */
  async getPedometerHistory(startDate, endDate) {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Pedometer is not available on this device');
      }
      return await Pedometer.getStepCountAsync(startDate, endDate);
    } catch (error) {
      console.error('Error getting pedometer history:', error);
      throw error;
    }
  },

  /**
   * Categorize light level
   */
  categorizeLightLevel(illuminance) {
    if (illuminance < 1) return 'very_dark';
    if (illuminance < 10) return 'dark';
    if (illuminance < 50) return 'dim';
    if (illuminance < 200) return 'indoor';
    if (illuminance < 1000) return 'bright_indoor';
    if (illuminance < 10000) return 'outdoor_shade';
    if (illuminance < 50000) return 'outdoor_cloudy';
    return 'outdoor_sunny';
  },

  /**
   * Remove sensor subscription safely
   */
  removeSubscription(subscription) {
    try {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing subscription:', error);
      return false;
    }
  },

  /**
   * Get comprehensive sensor availability report
   */
  async getSensorAvailabilityReport() {
    const sensors = [
      'accelerometer', 'gyroscope', 'magnetometer', 
      'barometer', 'lightSensor', 'deviceMotion', 'pedometer'
    ];
    
    const report = {};
    for (const sensor of sensors) {
      report[sensor] = await this.isSensorAvailable(sensor);
    }
    
    return report;
  }
};

// ============================================================================
// ENHANCED NOTIFICATION UTILITIES
// ============================================================================

export const notificationUtils = {
  /**
   * Setup notification handler with comprehensive options
   */
  setupNotificationHandler(options = {}) {
    const defaultOptions = {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      ...options
    };

    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        // Custom logic based on notification content
        const { data } = notification.request.content;
        
        // Override behavior based on notification data
        if (data?.priority === 'high') {
          return {
            ...defaultOptions,
            shouldPlaySound: true,
            shouldShowBanner: true
          };
        }
        
        if (data?.silent === true) {
          return {
            ...defaultOptions,
            shouldShowBanner: false,
            shouldPlaySound: false
          };
        }
        
        return defaultOptions;
      },
      handleSuccess: (notificationId) => {
        console.log('Notification handled successfully:', notificationId);
      },
      handleError: (notificationId, error) => {
        console.error('Notification handling error:', notificationId, error);
      }
    });
  },

  /**
   * Register for push notifications with comprehensive setup
   */
  async registerForPushNotifications(options = {}) {
    const {
      retries = 3,
      delay = 2000,
      customChannels = [],
      requestPermissions = true
    } = options;

    try {
      if (!Device.isDevice) {
        throw new Error('Must use physical device for Push Notifications');
      }

      let attempts = 0;
      let token = null;

      while (attempts < retries && !token) {
        attempts++;
        try {
          // Request permissions if needed
          if (requestPermissions) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
              const { status } = await Notifications.requestPermissionsAsync({
                ios: {
                  allowAlert: true,
                  allowBadge: true,
                  allowSound: true,
                  allowCriticalAlerts: false,
                  allowProvisional: false,
                  allowDisplayInCarPlay: false,
                }
              });
              finalStatus = status;
            }

            if (finalStatus !== 'granted') {
              throw new Error('Push notification permissions denied');
            }
          }

          // Setup Android channels
          if (Platform.OS === 'android') {
            // Default channel
            await Notifications.setNotificationChannelAsync('default', {
              name: 'Default',
              importance: Notifications.AndroidImportance.MAX,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: '#FF231F7C',
            });

            // Setup custom channels
            for (const channel of customChannels) {
              await this.createNotificationChannel(channel.id, channel.name, channel.options);
            }
          }

          // Get Expo push token
          const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? 
                           Constants?.easConfig?.projectId;
          if (!projectId) {
            throw new Error('Project ID not found');
          }

          const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
          token = tokenData.data;

          // Setup push token listener for token changes
          this.setupPushTokenListener();

        } catch (error) {
          if (attempts === retries) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      throw error;
    }
  },

  /**
   * Setup push token change listener
   */
  setupPushTokenListener() {
    return Notifications.addPushTokenListener(async (token) => {
      console.log('Push token updated:', token);
      // Store new token
      await AsyncStorage.setItem('expo_push_token', JSON.stringify(token));
      // Notify your backend about token change
      // await updateTokenOnServer(token);
    });
  },

  /**
   * Create notification channel with advanced options
   */
  async createNotificationChannel(channelId, name, options = {}) {
    if (Platform.OS !== 'android') return false;

    try {
      const defaultOptions = {
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        enableLights: true,
        enableVibrate: true,
        showBadge: true,
        ...options
      };

      await Notifications.setNotificationChannelAsync(channelId, {
        name,
        ...defaultOptions
      });
      return true;
    } catch (error) {
      console.error('Error creating notification channel:', error);
      throw error;
    }
  },

  /**
   * Schedule notification with advanced trigger options
   */
  async scheduleNotification(content, trigger = null, options = {}) {
    try {
      const { channelId = 'default', identifier } = options;

      const notificationContent = {
        ...content,
        data: {
          timestamp: Date.now(),
          ...content.data
        }
      };

      if (Platform.OS === 'android') {
        notificationContent.channelId = channelId;
      }

      const requestInput = {
        content: notificationContent,
        trigger,
      };

      if (identifier) {
        requestInput.identifier = identifier;
      }

      const notificationId = await Notifications.scheduleNotificationAsync(requestInput);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  },

  /**
   * Schedule recurring notifications
   */
  async scheduleRecurringNotification(content, recurringOptions) {
    const { type, interval, ...triggerOptions } = recurringOptions;
    
    let trigger;
    switch (type) {
      case 'daily':
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: triggerOptions.hour || 9,
          minute: triggerOptions.minute || 0,
          ...triggerOptions
        };
        break;
      case 'weekly':
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: triggerOptions.weekday || 1, // Sunday
          hour: triggerOptions.hour || 9,
          minute: triggerOptions.minute || 0,
          ...triggerOptions
        };
        break;
      case 'interval':
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: interval || 3600, // 1 hour default
          repeats: true,
          ...triggerOptions
        };
        break;
      default:
        throw new Error(`Unknown recurring notification type: ${type}`);
    }

    return await this.scheduleNotification(content, trigger);
  },

  /**
   * Setup comprehensive notification listeners
   */
  setupNotificationListeners(callbacks = {}) {
    const {
      onNotificationReceived,
      onNotificationResponse,
      onNotificationsDropped
    } = callbacks;

    const subscriptions = [];

    // Received listener
    if (onNotificationReceived) {
      const receivedSubscription = Notifications.addNotificationReceivedListener(
        (notification) => {
          const enhancedNotification = {
            ...notification,
            receivedAt: Date.now(),
            isBackground: false // This listener only fires when app is foreground
          };
          onNotificationReceived(enhancedNotification);
        }
      );
      subscriptions.push(receivedSubscription);
    }

    // Response listener
    if (onNotificationResponse) {
      const responseSubscription = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const enhancedResponse = {
            ...response,
            respondedAt: Date.now(),
            isDefaultAction: response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
          };
          onNotificationResponse(enhancedResponse);
        }
      );
      subscriptions.push(responseSubscription);
    }

    // Dropped listener (Android only)
    if (onNotificationsDropped && Platform.OS === 'android') {
      const droppedSubscription = Notifications.addNotificationsDroppedListener(() => {
        onNotificationsDropped();
      });
      subscriptions.push(droppedSubscription);
    }

    return subscriptions;
  },

  /**
   * Get notification statistics
   */
  async getNotificationStats() {
    try {
      const [scheduled, presented, channels] = await Promise.all([
        Notifications.getAllScheduledNotificationsAsync(),
        Notifications.getPresentedNotificationsAsync(),
        Platform.OS === 'android' ? Notifications.getNotificationChannelsAsync() : []
      ]);

      return {
        scheduledCount: scheduled.length,
        presentedCount: presented.length,
        channelsCount: channels.length,
        scheduled,
        presented,
        channels
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return null;
    }
  },

  /**
   * Clear all notifications
   */
  async clearAllNotifications() {
    try {
      await Promise.all([
        Notifications.cancelAllScheduledNotificationsAsync(),
        Notifications.dismissAllNotificationsAsync()
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return false;
    }
  },

  /**
   * Manage app badge count
   */
  async setBadgeCount(count) {
    try {
      const success = await Notifications.setBadgeCountAsync(count);
      return success;
    } catch (error) {
      console.error('Error setting badge count:', error);
      return false;
    }
  },

  async getBadgeCount() {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  }
};

// ============================================================================
// LOCATION UTILITIES
// ============================================================================

export const locationUtils = {
  /**
   * Request location permissions with detailed options
   */
  async requestLocationPermissions(type = 'foreground') {
    try {
      let result;
      if (type === 'background') {
        // First get foreground permissions
        const foregroundResult = await Location.requestForegroundPermissionsAsync();
        if (foregroundResult.status !== 'granted') {
          throw new Error('Foreground location permission required for background permission');
        }
        result = await Location.requestBackgroundPermissionsAsync();
      } else {
        result = await Location.requestForegroundPermissionsAsync();
      }
      
      return result;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      throw error;
    }
  },

  /**
   * Get current location with retry logic
   */
  async getCurrentLocation(options = {}, retries = 3) {
    const defaultOptions = {
      accuracy: Location.Accuracy.Balanced,
      mayShowUserSettingsDialog: true,
      ...options
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Location permission not granted');
        }

        return await Location.getCurrentPositionAsync(defaultOptions);
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  },

  /**
   * Watch location with enhanced options
   */
  async watchLocation(callback, options = {}) {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      const defaultOptions = {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10,
        ...options
      };

      return await Location.watchPositionAsync(
        defaultOptions,
        (location) => {
          const enhancedLocation = {
            ...location,
            receivedAt: Date.now(),
            speed: location.coords.speed ? {
              mps: location.coords.speed,
              kmh: location.coords.speed * 3.6,
              mph: location.coords.speed * 2.237
            } : null
          };
          callback(enhancedLocation);
        }
      );
    } catch (error) {
      console.error('Error watching location:', error);
      throw error;
    }
  },

  /**
   * Geocode address to coordinates
   */
  async geocodeAddress(address) {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission required for geocoding');
      }

      return await Location.geocodeAsync(address);
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw error;
    }
  },

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(latitude, longitude) {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission required for reverse geocoding');
      }

      return await Location.reverseGeocodeAsync({ latitude, longitude });
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  }
};

// ============================================================================
// SCREEN CAPTURE UTILITIES
// ============================================================================

export const screenCaptureUtils = {
  /**
   * Setup screen capture protection
   */
  async enableScreenProtection(key = 'default') {
    try {
      await ScreenCapture.preventScreenCaptureAsync(key);
      return true;
    } catch (error) {
      console.error('Error enabling screen protection:', error);
      return false;
    }
  },

  /**
   * Disable screen capture protection
   */
  async disableScreenProtection(key = 'default') {
    try {
      await ScreenCapture.allowScreenCaptureAsync(key);
      return true;
    } catch (error) {
      console.error('Error disabling screen protection:', error);
      return false;
    }
  },

  /**
   * Setup screenshot detection
   */
  setupScreenshotDetection(callback) {
    try {
      return ScreenCapture.addScreenshotListener(() => {
        callback({
          timestamp: Date.now(),
          platform: Platform.OS
        });
      });
    } catch (error) {
      console.error('Error setting up screenshot detection:', error);
      return null;
    }
  }
};

// ============================================================================
// DOCUMENT PICKER UTILITIES
// ============================================================================

export const documentUtils = {
  /**
   * Pick documents with enhanced options
   */
  async pickDocuments(options = {}) {
    try {
      const defaultOptions = {
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
        ...options
      };

      const result = await DocumentPicker.getDocumentAsync(defaultOptions);
      
      if (!result.canceled && result.assets) {
        // Enhance result with additional info
        const enhancedAssets = result.assets.map(asset => ({
          ...asset,
          pickedAt: Date.now(),
          sizeFormatted: this.formatFileSize(asset.size),
          extension: asset.name.split('.').pop()?.toLowerCase()
        }));

        return {
          ...result,
          assets: enhancedAssets
        };
      }

      return result;
    } catch (error) {
      console.error('Error picking documents:', error);
      throw error;
    }
  },

  /**
   * Format file size in human readable format
   */
  formatFileSize(bytes) {
    if (!bytes) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

export const storageUtils = {
  /**
   * Store data with metadata
   */
  async storeData(key, value, metadata = {}) {
    try {
      const dataToStore = {
        value,
        metadata: {
          createdAt: Date.now(),
          ...metadata
        }
      };
      await AsyncStorage.setItem(key, JSON.stringify(dataToStore));
      return true;
    } catch (error) {
      console.error('Error storing data:', error);
      return false;
    }
  },

  /**
   * Get data with metadata
   */
  async getData(key, includeMetadata = false) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null) return null;
      
      const parsedData = JSON.parse(jsonValue);
      
      if (includeMetadata) {
        return parsedData;
      }
      
      return parsedData.value || parsedData;
    } catch (error) {
      console.error('Error getting data:', error);
      return null;
    }
  },

  /**
   * Remove data
   */
  async removeData(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing data:', error);
      return false;
    }
  },

  /**
   * Get all keys
   */
  async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  },

  /**
   * Clear all data
   */
  async clearAll() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }
};