I'll help you implement utility functions specifically for Expo Sensors and Expo Notifications based on the information you've provided.

Let's add sensor-related utilities to work with the device's accelerometer, gyroscope, and other sensors available through Expo Sensors, as well as enhance the notification utilities with more specific functions.

```javascript
// sensorUtils.js

import {
  Accelerometer,
  Gyroscope,
  Magnetometer,
  Barometer,
  LightSensor,
  Pedometer,
  DeviceMotion,
} from 'expo-sensors';
import { Platform } from 'react-native';

// Sensor utilities
export const sensorUtils = {
  /**
   * Check if a specific sensor is available
   */
  async isSensorAvailable(sensor) {
    try {
      const isAvailable = await sensor.isAvailableAsync();
      return isAvailable;
    } catch (error) {
      console.error(`Error checking availability for ${sensor.name}:`, error);
      return false;
    }
  },

  /**
   * Set update interval for a sensor
   */
  setSensorUpdateInterval(sensor, intervalMs) {
    try {
      // Starting from Android 12, there's a 200ms limit for sensor updates
      const minInterval = Platform.OS === 'android' ? Math.max(200, intervalMs) : intervalMs;
      sensor.setUpdateInterval(minInterval);
      return true;
    } catch (error) {
      console.error(`Error setting update interval for ${sensor.name}:`, error);
      return false;
    }
  },

  /**
   * Subscribe to accelerometer updates
   */
  subscribeToAccelerometer(listener, intervalMs = 100) {
    try {
      this.setSensorUpdateInterval(Accelerometer, intervalMs);
      const subscription = Accelerometer.addListener(listener);
      return subscription;
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
      const subscription = Gyroscope.addListener(listener);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to gyroscope:', error);
      throw error;
    }
  },

  /**
   * Subscribe to magnetometer updates
   */
  subscribeToMagnetometer(listener, intervalMs = 100) {
    try {
      this.setSensorUpdateInterval(Magnetometer, intervalMs);
      const subscription = Magnetometer.addListener(listener);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to magnetometer:', error);
      throw error;
    }
  },

  /**
   * Subscribe to barometer updates
   */
  subscribeToBarometer(listener, intervalMs = 100) {
    try {
      this.setSensorUpdateInterval(Barometer, intervalMs);
      const subscription = Barometer.addListener(listener);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to barometer:', error);
      throw error;
    }
  },

  /**
   * Subscribe to light sensor updates
   */
  subscribeToLightSensor(listener, intervalMs = 100) {
    try {
      this.setSensorUpdateInterval(LightSensor, intervalMs);
      const subscription = LightSensor.addListener(listener);
      return subscription;
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
      const subscription = Pedometer.watchStepCount(listener);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to pedometer:', error);
      throw error;
    }
  },

  /**
   * Subscribe to device motion updates
   */
  subscribeToDeviceMotion(listener, intervalMs = 100) {
    try {
      this.setSensorUpdateInterval(DeviceMotion, intervalMs);
      const subscription = DeviceMotion.addListener(listener);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to device motion:', error);
      throw error;
    }
  },

  /**
   * Get pedometer data between dates
   */
  async getPedometerData(startDate, endDate) {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Pedometer is not available on this device');
      }
      const result = await Pedometer.getStepCountAsync(startDate, endDate);
      return result;
    } catch (error) {
      console.error('Error getting pedometer data:', error);
      throw error;
    }
  },

  /**
   * Remove subscription
   */
  removeSubscription(subscription) {
    try {
      subscription && subscription.remove();
      return true;
    } catch (error) {
      console.error('Error removing subscription:', error);
      return false;
    }
  }
};

// Enhanced notification utilities
export const notificationUtils = {
  /**
   * Set up notification handler with custom behavior
   */
  setupNotifications(handlerOptions = {}) {
    try {
      const defaultOptions = {
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        ...handlerOptions
      };
      
      Notifications.setNotificationHandler({
        handleNotification: async () => defaultOptions,
      });
      return true;
    } catch (error) {
      console.error('Error setting up notifications:', error);
      return false;
    }
  },

  /**
   * Register for push notifications with retry logic
   */
  async registerForPushNotifications(retries = 3, delay = 2000) {
    try {
      if (!Device.isDevice) {
        throw new Error('Must use physical device for Push Notifications');
      }

      let attempts = 0;
      let token = null;

      while (attempts < retries && !token) {
        attempts++;
        try {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;

          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync({
              ios: {
                allowAlert: true,
                allowBadge: true,
                allowSound: true,
              }
            });
            finalStatus = status;
          }

          if (finalStatus !== 'granted') {
            throw new Error('Failed to get push token for push notification!');
          }

          const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
          if (!projectId) {
            throw new Error('Project ID not found');
          }

          token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        } catch (error) {
          if (attempts === retries) {
            throw error;
          }
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      if (!token) {
        throw new Error('Failed to get push token after maximum retries');
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      throw error;
    }
  },

  /**
   * Schedule a local notification with advanced options
   */
  async scheduleNotification(title, body, data = {}, trigger = null, channelId = 'default') {
    try {
      const content = {
        title,
        body,
        data,
      };

      if (Platform.OS === 'android') {
        content.channelId = channelId;
      }

      const id = await Notifications.scheduleNotificationAsync({
        content,
        trigger,
      });
      return id;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  },

  /**
   * Create a notification channel for Android
   */
  async createNotificationChannel(channelId, name, options = {}) {
    try {
      if (Platform.OS === 'android') {
        const defaultOptions = {
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          ...options
        };
        await Notifications.setNotificationChannelAsync(channelId, {
          name,
          ...defaultOptions
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating notification channel:', error);
      throw error;
    }
  },

  /**
   * Set up notification listeners
   */
  setupNotificationListeners(onNotificationReceived, onNotificationResponse) {
    try {
      const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
        onNotificationReceived && onNotificationReceived(notification);
      });

      const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        onNotificationResponse && onNotificationResponse(response);
      });

      return {
        receivedSubscription,
        responseSubscription
      };
    } catch (error) {
      console.error('Error setting up notification listeners:', error);
      throw error;
    }
  },

  /**
   * Clear all scheduled notifications
   */
  async clearAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.dismissAllNotificationsAsync();
      return true;
    } catch (error) {
      console.error('Error clearing notifications:', error);
      throw error;
    }
  }
};
```

### How to Use These Utilities

1. **Sensor Utilities**: These functions help you interact with various device sensors. You can check if a sensor is available, subscribe to updates, and manage the update intervals.

   Example usage in a component:

   ```javascript
   import { sensorUtils } from './sensorUtils';
   import { useEffect } from 'react';

   export default function MotionSensorComponent() {
     useEffect(() => {
       async function setupSensors() {
         try {
           // Check if accelerometer is available
           const isAccelerometerAvailable = await sensorUtils.isSensorAvailable(Accelerometer);
           if (isAccelerometerAvailable) {
             const subscription = sensorUtils.subscribeToAccelerometer((data) => {
               console.log('Accelerometer data:', data);
             });
             return () => sensorUtils.removeSubscription(subscription);
           }
         } catch (error) {
           console.error('Sensor setup error:', error);
         }
       }
       setupSensors();
     }, []);

     return null;
   }
   ```

2. **Notification Utilities**: These enhanced functions provide more control over notifications, including creating custom channels for Android, setting up listeners, and implementing retry logic for token registration.

   Example usage in a component:

   ```javascript
   import { notificationUtils } from './sensorUtils';
   import { useEffect } from 'react';
   import { View, Button } from 'react-native';

   export default function NotificationComponent() {
     useEffect(() => {
       async function setup() {
         try {
           // Setup notification handler
           notificationUtils.setupNotifications({
             shouldPlaySound: true
           });
           
           // Register for push notifications
           const token = await notificationUtils.registerForPushNotifications();
           console.log('Push token:', token);
           
           // Setup listeners
           const listeners = notificationUtils.setupNotificationListeners(
             (notification) => console.log('Received:', notification),
             (response) => console.log('Response:', response)
           );
           
           return () => {
             sensorUtils.removeSubscription(listeners.receivedSubscription);
             sensorUtils.removeSubscription(listeners.responseSubscription);
           };
         } catch (error) {
           console.error('Notification setup error:', error);
         }
       }
       setup();
     }, []);

     const scheduleNotification = async () => {
       await notificationUtils.scheduleNotification(
         'Reminder',
         'This is a test notification',
         { screen: 'Home' },
         { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5 }
       );
     };

     return (
       <View>
         <Button title="Schedule Notification" onPress={scheduleNotification} />
       </View>
     );
   }
   ```

These utility functions provide a robust foundation for working with sensors and notifications in your Expo app. They handle permissions, subscriptions, error handling, and platform-specific considerations. If you need additional specific functions for other sensors or notification features, let me know!