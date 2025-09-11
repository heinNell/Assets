Expo Sensors



A library that provides access to a device's accelerometer, barometer, motion, gyroscope, light, magnetometer, and pedometer.

Bundled version:
~15.0.6
expo-sensors provide various APIs for accessing device sensors to measure motion, orientation, pressure, magnetic fields, ambient light, and step count.

Installation
Terminal

Copy

npx expo install expo-sensors
If you are installing this in an existing React Native app, make sure to install expo in your project.

Configuration in app config
You can configure expo-sensors using its built-in config plugin if you use config plugins in your project (EAS Build or npx expo run:[android|ios]). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect.

Example app.json with config plugin
app.json

Copy


{
  "expo": {
    "plugins": [
      [
        "expo-sensors",
        {
          "motionPermission": "Allow $(PRODUCT_NAME) to access your device motion"
        }
      ]
    ]
  }
}
Configurable properties
Name	Default	Description
motionPermission	"Allow $(PRODUCT_NAME) to access your device motion"	
Only for: 

A string to set the NSMotionUsageDescription permission message or false to disable motion permissions.

API
import * as Sensors from 'expo-sensors';
// OR
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
Permissions
Android
Starting in Android 12 (API level 31), the system has a 200Hz limit for each sensor updates.

If you need an update interval of less than 200Hz, you must add the following permissions to your app.json inside the expo.android.permissions array.

Android Permission	Description
HIGH_SAMPLING_RATE_SENSORS

Allows an app to access sensor data with a sampling rate greater than 200 Hz.

Are you using this library in an existing React Native app?
If you're not using Continuous Native Generation (CNG) or you're using native android project manually, add HIGH_SAMPLING_RATE_SENSORS permission to your project's android/app/src/main/AndroidManifest.xml:

<uses-permission android:name="android.permission.HIGH_SAMPLING_RATE_SENSORS" />


Expo Notifications



A library that provides an API to fetch push notification tokens and to present, schedule, receive and respond to notifications.

Bundled version:
~0.32.10
expo-notifications provides an API to fetch push notification tokens and to present, schedule, receive and respond to notifications.

Notification guides
Do not miss our guides on how to set up, send, and handle push notifications.

Push notifications (remote notifications) functionality provided by expo-notifications is unavailable in Expo Go on Android from SDK 53. A development build is required to use push notifications. Local notifications (in-app notifications) remain available in Expo Go.
Features
Schedule a one-off notification for a specific date or some time from now
Schedule a notification repeating in some time interval (or a calendar date match on iOS)
Get and set the application badge icon number
Obtain a native device push token, so you can send push notifications with FCM (for Android) and APNs (for iOS)
Obtain an Expo push token, so you can send push notifications with Expo Push Service
Listen to incoming notifications in the foreground and background
Listen to interactions with notifications
Handle notifications when the app is in the foreground
Imperatively dismiss notifications from Notification Center/tray
Create, update, and delete Android notification channels
Set custom icon and color for notifications on Android
Installation
Terminal

Copy

npx expo install expo-notifications
If you are installing this in an existing React Native app, make sure to install expo in your project.


Then proceed to configuration to set up the config plugin and obtain the credentials for push notifications.

Known issues 
When launching the app from a push notification in Android development builds, the splash screen may fail to display correctly about 70% of the time. The icon and fade animation may not appear as expected.

Icon may be missing
Fade animation may not run
Only the background color may flash briefly
This issue only affects debug builds and does not occur in release builds. To workaround it, test notification launches in release mode (npx expo run:android --variant release) for accurate behavior.

Usage
Check out the example Snack below to see Notifications in action, make sure to use a physical device to test it. Push notifications don't work on emulators/simulators.

Push Notifications

Copy


Open in Snack


import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <Text>{`Channels: ${JSON.stringify(
        channels.map(c => c.id),
        null,
        2
      )}`}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here', test: { test1: 'more data' } },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('myNotificationChannel', {
      name: 'A channel is needed for the permissions prompt to appear',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
Present a local (in-app) notification to the user
import * as Notifications from 'expo-notifications';

// First, set the handler that will cause the notification
// to show the alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Second, call scheduleNotificationAsync()
Notifications.scheduleNotificationAsync({
  content: {
    title: 'Look at that notification',
    body: "I'm so proud of myself!",
  },
  trigger: null,
});
Handle push notifications with navigation
If you'd like to deep link to a specific screen in your app when you receive a push notification, you can configure either of Expo's navigation systems to do that.


Expo Router


React Navigation

React Navigation's manual linking configuration can be configured to handle incoming redirects from push notifications:

App.tsx

Copy


import React from 'react';
import { Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer
      linking={{
        config: {
          // Configuration for linking
        },
        async getInitialURL() {
          // First, you may want to do the default deep link handling
          // Check if app was opened from a deep link
          const url = await Linking.getInitialURL();

          if (url != null) {
            return url;
          }

          // Handle URL from expo push notifications
          const response = Notifications.getLastNotificationResponse();

          return response?.notification.request.content.data.url;
        },
        subscribe(listener) {
          const onReceiveURL = ({ url }: { url: string }) => listener(url);

          // Listen to incoming links from deep linking
          const eventListenerSubscription = Linking.addEventListener('url', onReceiveURL);

          // Listen to expo push notifications
          const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const url = response.notification.request.content.data.url;

            // Any custom logic to see whether the URL needs to be handled
            //...

            // Let React Navigation handle the URL
            listener(url);
          });

          return () => {
            // Clean up the event listeners
            eventListenerSubscription.remove();
            subscription.remove();
          };
        },
      }}>
      {/* Your app content */}
    </NavigationContainer>
  );
}
See more details on React Navigation documentation.

Configuration
Credentials
Follow the setup guide.

App config
To configure expo-notifications, use the built-in config plugin in the app config (app.json or app.config.js) for EAS Build or with npx expo run:[android|ios]. The plugin allows you to configure the following properties that cannot be set at runtime and require building a new app binary to take effect:

Configurable properties
Name	Default	Description
icon	-	
Only for: 

Local path to an image to use as the icon for push notifications. 96x96 all-white png with transparency.

color	#ffffff	
Only for: 

Tint color for the push notification image when it appears in the notification tray.

defaultChannel	-	
Only for: 

Default channel for FCMv1 notifications.

sounds	-	
Array of local paths to sound files (.wav recommended) that can be used as custom notification sounds. Sound will not be played when focus mode does not permit it or silent mode is on.

enableBackgroundRemoteNotifications	false	
Only for: 

Whether to enable background remote notifications, as described in Apple documentation. This updates the UIBackgroundModes key in the Info.plist to include remote-notification.

Here is an example of using the config plugin in the app config file:

app.json

Copy


{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./local/assets/notification_icon.png",
          "color": "#ffffff",
          "defaultChannel": "default",
          "sounds": [
            "./local/assets/notification_sound.wav",
            "./local/assets/notification_sound_other.wav"
          ],
          "enableBackgroundRemoteNotifications": false
        }
      ]
    ]
  }
}
The iOS APNs entitlement is always set to 'development'. Xcode automatically changes this to 'production' in the archive generated by a release build. Learn more.

Are you using this library in an existing React Native app?
Learn how to configure the native projects in the installation instructions in the expo-notifications repository.

Permissions
Android
On Android, this module requires permission to subscribe to the device boot. It's used to set up scheduled notifications when the device (re)starts. The RECEIVE_BOOT_COMPLETED permission is added automatically through the library's AndroidManifest.xml.

Starting from Android 12 (API level 31), to schedule a notification that triggers at an exact time, you need to add <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/> to AndroidManifest.xml. Read more about the exact alarm permission.

On Android 13, app users must opt-in to receive notifications via a permissions prompt automatically triggered by the operating system. This prompt will not appear until at least one notification channel is created. The setNotificationChannelAsync must be called before getDevicePushTokenAsync or getExpoPushTokenAsync to obtain a push token. You can read more about the new notification permission behavior for Android 13 in the official documentation.

Android Permission	Description
RECEIVE_BOOT_COMPLETED

Allows an application to receive the Intent.ACTION_BOOT_COMPLETED that is broadcast after the system finishes booting.

Allows an application to receive the Intent.ACTION_BOOT_COMPLETED that is broadcast after the system finishes booting. If you don't request this permission, you will not receive the broadcast at that time. Though holding this permission does not have any security implications, it can have a negative impact on the user experience by increasing the amount of time it takes the system to start and allowing applications to have themselves running without the user being aware of them. As such, you must explicitly declare your use of this facility to make that visible to the user.
SCHEDULE_EXACT_ALARM

Allows applications to use exact alarm APIs.

iOS
No usage description is required, see notification-related permissions.

Interpret the iOS permissions response
On iOS, permissions for sending notifications are a little more granular than they are on Android. This is why you should rely on the NotificationPermissionsStatus's ios.status field, instead of the root status field.

This value will be one of the following, accessible under Notifications.IosAuthorizationStatus:

NOT_DETERMINED: The user hasn't yet made a choice about whether the app is allowed to schedule notifications
DENIED: The app isn't authorized to schedule or receive notifications
AUTHORIZED: The app is authorized to schedule or receive notifications
PROVISIONAL: The app is provisionally authorized to post noninterruptive user notifications
EPHEMERAL: The app is authorized to schedule or receive notifications for a limited amount of time
Notification events listeners
Notification events include incoming notifications, interactions your users perform with notifications (this can be tapping on a notification, or interacting with it via notification categories), and rare occasions when your notifications may be dropped.

Several listeners are exposed and documented in the Push notification behaviors section.

Headless (Background) notifications
See the definition of Headless Background Notifications in the What you need to know guide.

To handle notifications while the app is in the background or not running, you need to do the following:

Add expo-task-manager package to your project.
Configure background notifications.
In your application code, set up a background task to run when the notification is received.
Then send a push notification which:

Contains only the data key (no title, body)
Has _contentAvailable: true set for iOS — see the Expo push notification service payload format
Background notification configuration 
To be able to use background push notifications on iOS, the remote-notification value needs to be present in the UIBackgroundModes array in your app's Info.plist file.

If you're using CNG, set the enableBackgroundRemoteNotifications property of the config plugin to true, and the correct configuration will be applied automatically by prebuild.

Configure UIBackgroundModes manually on iOS


Additional information
Set custom notification sounds
To add custom push notification sounds to your app, add the expo-notifications plugin to your app.json file and then under the sounds key, provide an array of local paths to sound files that can be used as custom notification sounds. These local paths are local to your project.

app.json

Copy


{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "sounds": ["local/path/to/mySoundFile.wav"]
        }
      ]
    ]
  }
}
After building your app, the array of files will be available for use in both NotificationContentInput and NotificationChannelInput. You only need to provide the base filename. Here's an example using the config above:

await Notifications.setNotificationChannelAsync('new_emails', {
  name: 'E-mail notifications',
  importance: Notifications.AndroidImportance.HIGH,
  sound: 'mySoundFile.wav', // Provide ONLY the base filename
});

await Notifications.scheduleNotificationAsync({
  content: {
    title: "You've got mail! 📬",
    sound: 'mySoundFile.wav', // Provide ONLY the base filename
  },
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: 2,
    channelId: 'new_emails',
  },
});
You can also manually add notification files to your Android and iOS projects if you prefer:

Manually adding notification sounds on Android
On Androids 8.0+, playing a custom sound for a notification requires more than setting the sound property on the NotificationContentInput. You will also need to configure the NotificationChannel with the appropriate sound, and use it when sending/scheduling the notification.

For the example below to work, you would place your email_sound.wav file in android/app/src/main/res/raw/.

// Prepare the notification channel
await Notifications.setNotificationChannelAsync('new_emails', {
  name: 'E-mail notifications',
  importance: Notifications.AndroidImportance.HIGH,
  sound: 'email_sound.wav', // <- for Android 8.0+, see channelId property below
});

// Eg. schedule the notification
await Notifications.scheduleNotificationAsync({
  content: {
    title: "You've got mail! 📬",
    body: 'Open the notification to read them all',
    sound: 'email_sound.wav', // <- for Android below 8.0
  },
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: 2,
    channelId: 'new_emails', // <- for Android 8.0+, see definition above
  },
});

Show More
Manually adding notification sounds on iOS

Push notification payload specification
See Message request format.

Manage notification categories for interactive notifications
Notification categories allow you to create interactive push notifications, so that a user can respond directly to the incoming notification either via buttons or a text response. A category defines the set of actions a user can take, and then those actions are applied to a notification by specifying the categoryIdentifier in the NotificationContent.

Image of notification categories on Android and iOS
On iOS, notification categories also allow you to customize your notifications further. With each category, not only can you set interactive actions a user can take, but you can also configure things like the placeholder text to display when the user disables notification previews for your app.

Platform-specific guides
Handling notification channels 
Starting in Android 8.0 (API level 26), all notifications must be assigned to a channel. For each channel, you can set the visual and auditory behavior that is applied to all notifications in that channel. Then, users can change these settings and decide which notification channels from your app should be intrusive or visible at all, as Android developer docs states.

If you do not specify a notification channel, expo-notifications will create a fallback channel for you, named Miscellaneous. We encourage you to always ensure appropriate channels with informative names are set up for the application and to always send notifications to these channels.

Calling these methods is a no-op for platforms that do not support this feature (Android below version 8.0 (26) and iOS).

Custom notification icon and colors 
You can configure the notification.icon and notification.color keys in the project's app.json if you are using Expo Prebuild or by using the expo-notifications config plugin directly. These are build-time settings, so you'll need to recompile your native Android app with eas build -p android or npx expo run:android to see the changes.

For your notification icon, make sure you follow Google's design guidelines (the icon must be all white with a transparent background) or else it may not be displayed as intended.

You can also set a custom notification color per-notification directly in your NotificationContentInput under the color attribute.

API
import * as Notifications from 'expo-notifications';
Fetch tokens for push notifications
addPushTokenListener(listener)
Parameter	Type	Description
listener	PushTokenListener	
A function accepting a push token as an argument, it will be called whenever the push token changes.


In rare situations, a push token may be changed by the push notification service while the app is running. When a token is rolled, the old one becomes invalid and sending notifications to it will fail. A push token listener will let you handle this situation gracefully by registering the new token with your backend right away.

Returns:
EventSubscription
An EventSubscription object represents the subscription of the provided listener.

Example

import React from 'react';
import * as Notifications from 'expo-notifications';

import { registerDevicePushTokenAsync } from '../api';

export default function App() {
  React.useEffect(() => {
    const subscription = Notifications.addPushTokenListener(registerDevicePushTokenAsync);
    return () => subscription.remove();
  }, []);

  return (
    // Your app content
  );
}
getDevicePushTokenAsync()
Returns a native FCM, APNs token or a PushSubscription data that can be used with another push notification service.

Returns:
Promise<DevicePushToken>
getExpoPushTokenAsync(options)
Parameter	Type	Description
options
(optional)
ExpoPushTokenOptions	
Object allowing you to pass in push notification configuration.

Default:
{}

Returns an Expo token that can be used to send a push notification to the device using Expo's push notifications service.

This method makes requests to the Expo's servers. It can get rejected in cases where the request itself fails (for example, due to the device being offline, experiencing a network timeout, or other HTTPS request failures). To provide offline support to your users, you should try/catch this method and implement retry logic to attempt to get the push token later, once the device is back online.

For Expo's backend to be able to send notifications to your app, you will need to provide it with push notification keys. For more information, see credentials in the push notifications setup.

Returns:
Promise<ExpoPushToken>
Returns a Promise that resolves to an object representing acquired push token.

Example

import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync(userId: string) {
  const expoPushToken = await Notifications.getExpoPushTokenAsync({
   projectId: 'your-project-id',
  });

  await fetch('https://example.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      expoPushToken,
    }),
  });
}

Show More
Listen to notification events
addNotificationReceivedListener(listener)
Parameter	Type	Description
listener	(event: Notification) => void	
A function accepting a notification (Notification) as an argument.


Listeners registered by this method will be called whenever a notification is received while the app is running.

Returns:
EventSubscription
An EventSubscription object represents the subscription of the provided listener.

Example

import React from 'react';
import * as Notifications from 'expo-notifications';

export default function App() {
  React.useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });
    return () => subscription.remove();
  }, []);

  return (
    // Your app content
  );
}
addNotificationResponseReceivedListener(listener)
Parameter	Type	Description
listener	(event: NotificationResponse) => void	
A function accepting notification response (NotificationResponse) as an argument.


Listeners registered by this method will be called whenever a user interacts with a notification (for example, taps on it).

Returns:
EventSubscription
An EventSubscription object represents the subscription of the provided listener.

Example

import React from 'react';
import { Linking } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function Container() {
  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const url = response.notification.request.content.data.url;
      Linking.openURL(url);
    });
    return () => subscription.remove();
  }, []);

  return (
    // Your app content
  );
}
addNotificationsDroppedListener(listener)
Parameter	Type	Description
listener	() => void	
A callback function.


Listeners registered by this method will be called whenever some notifications have been dropped by the server. Applicable only to Firebase Cloud Messaging which we use as a notifications service on Android. It corresponds to onDeletedMessages() callback. More information can be found in Firebase docs.

Returns:
EventSubscription
An EventSubscription object represents the subscription of the provided listener.

useLastNotificationResponse()
A React hook which returns the notification response that was received most recently (a notification response designates an interaction with a notification, such as tapping on it).

To clear the last notification response, use clearLastNotificationResponseAsync().

If you don't want to use a hook, you can use Notifications.getLastNotificationResponseAsync() instead.

Returns:
MaybeNotificationResponse
The hook may return one of these three types/values:

undefined - until we're sure of what to return,
null - if no notification response has been received yet,
a NotificationResponse object - if a notification response was received.
Example

Responding to a notification tap by opening a URL that could be put into the notification's data (opening the URL is your responsibility and is not a part of the expo-notifications API):

import * as Notifications from 'expo-notifications';
import { Linking } from 'react-native';

export default function App() {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  React.useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.url &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      Linking.openURL(lastNotificationResponse.notification.request.content.data.url);
    }
  }, [lastNotificationResponse]);
  return (
    // Your app content
  );
}

Show More
Present incoming notifications when the app is running
setNotificationHandler(handler)
Parameter	Type	Description
handler	null | NotificationHandler	
A single parameter which should be either null (if you want to clear the handler) or a NotificationHandler object.


When a notification is received while the app is running, using this function you can set a callback that will decide whether the notification should be shown to the user or not.

When a notification is received, handleNotification is called with the incoming notification as an argument. The function should respond with a behavior object within 3 seconds, otherwise, the notification will be discarded. If the notification is handled successfully, handleSuccess is called with the identifier of the notification, otherwise (or on timeout) handleError will be called.

The default behavior when the handler is not set or does not respond in time is not to show the notification.

Returns:
void
Example

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
Run JavaScript in response to incoming notifications
registerTaskAsync(taskName)
Parameter	Type	Description
taskName	string	
The string you passed to TaskManager.defineTask as the taskName parameter.


Call registerTaskAsync to set a callback (task) that runs when a notification is received while the app is in foreground, background, or terminated. Only on Android, the task also runs in response to a notification action press when the app is backgrounded or terminated. When the app is terminated, only a Headless Background Notification triggers the task execution. However, the OS may decide not to deliver the notification to your app in some cases (e.g. when the device is in Doze mode on Android, or when you send too many notifications - Apple recommends to not "send more than two or three per hour").

Under the hood, this function is run using expo-task-manager. You must define the task first, with TaskManager.defineTask and register it with registerTaskAsync.

Make sure you define and register the task in the module scope of a JS module which is required early by your app (e.g. in the index.js file). expo-task-manager loads your app's JS bundle in the background and executes the task, as well as any side effects which may happen as a consequence of requiring any JS modules.

The callback function you define with TaskManager.defineTask receives an object with the following fields:

data: The remote payload delivered by either FCM (Android) or APNs (iOS). See NotificationTaskPayload for details.
error: The error (if any) that occurred during execution of the task.
executionInfo: JSON object of additional info related to the task, including the taskName.
Returns:
Promise<null>
Example

import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask<Notifications.NotificationTaskPayload>(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  console.log('Received a notification task payload!');
  const isNotificationResponse = 'actionIdentifier' in data;
  if (isNotificationResponse) {
    // Do something with the notification response from user
  } else {
    // Do something with the data from notification that was received
  }
});

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
unregisterTaskAsync(taskName)
Parameter	Type	Description
taskName	string	
The string you passed to registerTaskAsync as the taskName parameter.


Used to unregister tasks registered with registerTaskAsync method.

Returns:
Promise<null>
Fetch information about notifications-related permissions
getPermissionsAsync()
Calling this function checks current permissions settings related to notifications. It lets you verify whether the app is currently allowed to display alerts, play sounds, etc. There is no user-facing effect of calling this.

Returns:
Promise<NotificationPermissionsStatus>
It returns a Promise resolving to an object represents permission settings (NotificationPermissionsStatus). On iOS, make sure you properly interpret the permissions response.

Example

import * as Notifications from 'expo-notifications';

export async function allowsNotificationsAsync() {
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}
requestPermissionsAsync(permissions)
Parameter	Type	Description
permissions
(optional)
NotificationPermissionsRequest	
An object representing configuration for the request scope.


Prompts the user for notification permissions according to request. Request defaults to asking the user to allow displaying alerts, setting badge count and playing sounds.

Returns:
Promise<NotificationPermissionsStatus>
It returns a Promise resolving to an object represents permission settings (NotificationPermissionsStatus). On iOS, make sure you properly interpret the permissions response.

Example

import * as Notifications from 'expo-notifications';

export function requestPermissionsAsync() {
  return Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
}
Manage application badge icon
getBadgeCountAsync()
Fetches the number currently set as the badge of the app icon on device's home screen. A 0 value means that the badge is not displayed.

Note: Not all Android launchers support application badges. If the launcher does not support icon badges, the method will always resolve to 0.

Returns:
Promise<number>
Returns a Promise resolving to a number that represents the current badge of the app icon.

setBadgeCountAsync(badgeCount, options)
Parameter	Type	Description
badgeCount	number	
The count which should appear on the badge. A value of 0 will clear the badge.

options
(optional)
SetBadgeCountOptions	
An object of options configuring behavior applied.


Sets the badge of the app's icon to the specified number. Setting it to 0 clears the badge. On iOS, this method requires that you have requested the user's permission for allowBadge via requestPermissionsAsync, otherwise it will automatically return false.

Note: Not all Android launchers support application badges. If the launcher does not support icon badges, the method will resolve to false.

Returns:
Promise<boolean>
It returns a Promise resolving to a boolean representing whether the setting of the badge succeeded.

Schedule notifications
cancelAllScheduledNotificationsAsync()
Cancels all scheduled notifications.

Returns:
Promise<void>
A Promise that resolves once all the scheduled notifications are successfully canceled, or if there are no scheduled notifications.

cancelScheduledNotificationAsync(identifier)
Parameter	Type	Description
identifier	string	
The notification identifier with which scheduleNotificationAsync method resolved when the notification has been scheduled.


Cancels a single scheduled notification. The scheduled notification of given ID will not trigger.

Returns:
Promise<void>
A Promise resolves once the scheduled notification is successfully canceled or if there is no scheduled notification for a given identifier.

Example

import * as Notifications from 'expo-notifications';

async function scheduleAndCancel() {
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hey!',
    },
    trigger: { seconds: 60, repeats: true },
  });
  await Notifications.cancelScheduledNotificationAsync(identifier);
}
getAllScheduledNotificationsAsync()
Fetches information about all scheduled notifications.

Returns:
Promise<NotificationRequest[]>
Returns a Promise resolving to an array of objects conforming to the Notification interface.

getNextTriggerDateAsync(trigger)
Parameter	Type	Description
trigger	SchedulableNotificationTriggerInput	
The schedulable notification trigger you would like to check next trigger date for (of type SchedulableNotificationTriggerInput).


Allows you to check what will be the next trigger date for given notification trigger input.

Returns:
Promise<number | null>
If the return value is null, the notification won't be triggered. Otherwise, the return value is the Unix timestamp in milliseconds at which the notification will be triggered.

Example

import * as Notifications from 'expo-notifications';

async function logNextTriggerDate() {
  try {
    const nextTriggerDate = await Notifications.getNextTriggerDateAsync({
      hour: 9,
      minute: 0,
    });
    console.log(nextTriggerDate === null ? 'No next trigger date' : new Date(nextTriggerDate));
  } catch (e) {
    console.warn(`Couldn't have calculated next trigger date: ${e}`);
  }
}
scheduleNotificationAsync(request)
Parameter	Type	Description
request	NotificationRequestInput	
An object describing the notification to be triggered.


Schedules a notification to be triggered in the future.

Note: This does not mean that the notification will be presented when it is triggered. For the notification to be presented you have to set a notification handler with setNotificationHandler that will return an appropriate notification behavior. For more information see the example below.

Returns:
Promise<string>
Returns a Promise resolving to a string which is a notification identifier you can later use to cancel the notification or to identify an incoming notification.

Example

Schedule the notification that will trigger once, in one minute from now
import * as Notifications from 'expo-notifications';

Notifications.scheduleNotificationAsync({
  content: {
    title: "Time's up!",
    body: 'Change sides!',
  },
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: 60,
  },
});
Schedule the notification that will trigger repeatedly, every 20 minutes
import * as Notifications from 'expo-notifications';

Notifications.scheduleNotificationAsync({
  content: {
    title: 'Remember to drink water!',
  },
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: 60 * 20,
    repeats: true,
  },
});
Schedule the notification that will trigger once, at the beginning of next hour
import * as Notifications from 'expo-notifications';

const date = new Date(Date.now() + 60 * 60 * 1000);
date.setMinutes(0);
date.setSeconds(0);

Notifications.scheduleNotificationAsync({
  content: {
    title: 'Happy new hour!',
  },
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date
  },
});
Dismiss notifications
dismissAllNotificationsAsync()
Removes all application's notifications displayed in the notification tray (Notification Center).

Returns:
Promise<void>
A Promise which resolves once the request to dismiss the notifications is successfully dispatched to the notifications manager.

dismissNotificationAsync(notificationIdentifier)
Parameter	Type	Description
notificationIdentifier	string	
The notification identifier, obtained either via setNotificationHandler method or in the listener added with addNotificationReceivedListener.


Removes notification displayed in the notification tray (Notification Center).

Returns:
Promise<void>
A Promise which resolves once the request to dismiss the notification is successfully dispatched to the notifications manager.

getPresentedNotificationsAsync()
Fetches information about all notifications present in the notification tray (Notification Center).

This method is not supported on Android below 6.0 (API level 23) – on these devices it will resolve to an empty array.

Returns:
Promise<Notification[]>
A Promise which resolves with a list of notifications (Notification) currently present in the notification tray (Notification Center).

Manage notification channels (Android-specific)
deleteNotificationChannelAsync(channelId)
Parameter	Type	Description
channelId	string	
The channel identifier.


Removes the notification channel.

Returns:
Promise<void>
A Promise which resolving once the channel is removed (or if there was no channel for given identifier).

deleteNotificationChannelGroupAsync(groupId)
Parameter	Type	Description
groupId	string	
The channel group identifier.


Removes the notification channel group and all notification channels that belong to it.

Returns:
Promise<void>
A Promise which resolves once the channel group is removed (or if there was no channel group for given identifier).

getNotificationChannelAsync(channelId)
Parameter	Type	Description
channelId	string	
The channel's identifier.


Fetches information about a single notification channel.

Returns:
Promise<NotificationChannel | null>
A Promise which resolves to the channel object (of type NotificationChannel) or to null if there was no channel found for this identifier. On platforms that do not support notification channels, it will always resolve to null.

getNotificationChannelGroupAsync(groupId)
Parameter	Type	Description
groupId	string	
The channel group's identifier.


Fetches information about a single notification channel group.

Returns:
Promise<NotificationChannelGroup | null>
A Promise which resolves to the channel group object (of type NotificationChannelGroup) or to null if there was no channel group found for this identifier. On platforms that do not support notification channels, it will always resolve to null.

getNotificationChannelGroupsAsync()
Fetches information about all known notification channel groups.

Returns:
Promise<NotificationChannelGroup[]>
A Promise which resoles to an array of channel groups. On platforms that do not support notification channel groups, it will always resolve to an empty array.

getNotificationChannelsAsync()
Fetches information about all known notification channels.

Returns:
Promise<NotificationChannel[]>
A Promise which resolves to an array of channels. On platforms that do not support notification channels, it will always resolve to an empty array.

setNotificationChannelAsync(channelId, channel)
Parameter	Type	Description
channelId	string	
The channel identifier.

channel	NotificationChannelInput	
Object representing the channel's configuration.


Assigns the channel configuration to a channel of a specified name (creating it if need be). This method lets you assign given notification channel to a notification channel group.

Note: After a channel has been created, you can modify only its name and description. This limitation is imposed by the Android OS.

Note: For some settings to be applied on all Android versions, it may be necessary to duplicate the configuration across both a single notification and its respective notification channel.

For example, for a notification to play a custom sound on Android versions below 8.0, the custom notification sound has to be set on the notification (through the NotificationContentInput), and for the custom sound to play on Android versions above 8.0, the relevant notification channel must have the custom sound configured (through the NotificationChannelInput). For more information, see Set custom notification sounds on Android.

Returns:
Promise<NotificationChannel | null>
A Promise which resolving to the object (of type NotificationChannel) describing the modified channel or to null if the platform does not support notification channels.

setNotificationChannelGroupAsync(groupId, group)
Parameter	Type	Description
groupId	string	
The channel group's identifier.

group	NotificationChannelGroupInput	
Object representing the channel group configuration.


Assigns the channel group configuration to a channel group of a specified name (creating it if need be).

Returns:
Promise<NotificationChannelGroup | null>
A Promise resolving to the object (of type NotificationChannelGroup) describing the modified channel group or to null if the platform does not support notification channels.

Manage notification categories (interactive notifications)
deleteNotificationCategoryAsync(identifier)
Parameter	Type	Description
identifier	string	
Identifier initially provided to setNotificationCategoryAsync when creating the category.


Deletes the category associated with the provided identifier.

Returns:
Promise<boolean>
A Promise which resolves to true if the category was successfully deleted, or false if it was not. An example of when this method would return false is if you try to delete a category that doesn't exist.

getNotificationCategoriesAsync()
Fetches information about all known notification categories.

Returns:
Promise<NotificationCategory[]>
A Promise which resolves to an array of NotificationCategorys. On platforms that do not support notification channels, it will always resolve to an empty array.

setNotificationCategoryAsync(identifier, actions, options)
Parameter	Type	Description
identifier	string	
A string to associate as the ID of this category. You will pass this string in as the categoryIdentifier in your NotificationContent to associate a notification with this category.

Don't use the characters : or - in your category identifier. If you do, categories might not work as expected.

actions	NotificationAction[]	
An array of NotificationAction, which describe the actions associated with this category.

options
(optional)
NotificationCategoryOptions	
An optional object of additional configuration options for your category.


Sets the new notification category.

Returns:
Promise<NotificationCategory>
A Promise which resolves to the category you just have created.

Constants
Notifications.DEFAULT_ACTION_IDENTIFIER
Type: 'expo.modules.notifications.actions.DEFAULT'

Methods
Notifications.clearLastNotificationResponse()
Clears the notification response that was received most recently. May be used when an app selects a route based on the notification response, and it is undesirable to continue selecting the route after the response has already been handled.

If a component is using the useLastNotificationResponse hook, this call will also clear the value returned by the hook.

Returns:
void
Notifications.clearLastNotificationResponseAsync()
Clears the notification response that was received most recently. May be used when an app selects a route based on the notification response, and it is undesirable to continue selecting the route after the response has already been handled.

If a component is using the useLastNotificationResponse hook, this call will also clear the value returned by the hook.

Returns:
Promise<void>
A promise that resolves if the native call was successful.

Notifications.getLastNotificationResponse()
Gets the notification response that was received most recently (a notification response designates an interaction with a notification, such as tapping on it).

null - if no notification response has been received yet
a NotificationResponse object - if a notification response was received
Returns:
NotificationResponse | null
Notifications.getLastNotificationResponseAsync()
Gets the notification response received most recently (a notification response designates an interaction with a notification, such as tapping on it).

null - if no notification response has been received yet
a NotificationResponse object - if a notification response was received
Returns:
Promise<NotificationResponse | null>
Notifications.unregisterForNotificationsAsync()
Returns:
Promise<void>
Interfaces
AudioAttributes
Property	Type	Description
contentType	AndroidAudioContentType	
-
flags	
{
  enforceAudibility: boolean, 
  requestHardwareAudioVideoSynchronization: boolean
}
-
usage	AndroidAudioUsage	
-
BeaconRegion
Extends: Region

A region used to detect the presence of iBeacon devices. Based on Core Location CLBeaconRegion class.

Property	Type	Description
beaconIdentityConstraint
(optional)
{
  major: null | number, 
  minor: null | number, 
  uuid: string
}
The beacon identity constraint that defines the beacon region.

major	null | number	
The major value from the beacon identity constraint that defines the beacon region.

minor	null | number	
The minor value from the beacon identity constraint that defines the beacon region.

notifyEntryStateOnDisplay	boolean	
A Boolean value that indicates whether Core Location sends beacon notifications when the device’s display is on.

type	'beacon'	
-
uuid
(optional)
string	
The UUID value from the beacon identity constraint that defines the beacon region.

CalendarNotificationTrigger
A trigger related to a UNCalendarNotificationTrigger.

Property	Type	Description
dateComponents	
{
  calendar: string, 
  day: number, 
  era: number, 
  hour: number, 
  isLeapMonth: boolean, 
  minute: number, 
  month: number, 
  nanosecond: number, 
  quarter: number, 
  second: number, 
  timeZone: string, 
  weekday: number, 
  weekdayOrdinal: number, 
  weekOfMonth: number, 
  weekOfYear: number, 
  year: number, 
  yearForWeekOfYear: number
}
-
repeats	boolean	
-
type	'calendar'	
-
CircularRegion
Extends: Region

A circular geographic region, specified as a center point and radius. Based on Core Location CLCircularRegion class.

Property	Type	Description
center	
{
  latitude: number, 
  longitude: number
}
The center point of the geographic area.

radius	number	
The radius (measured in meters) that defines the geographic area’s outer boundary.

type	'circular'	
-
DailyNotificationTrigger
A trigger related to a daily notification.

The same functionality will be achieved on iOS with a CalendarNotificationTrigger.

Property	Type	Description
hour	number	
-
minute	number	
-
type	'daily'	
-
EventSubscription
A subscription object that allows to conveniently remove an event listener from the emitter.

EventSubscription Methods

remove()
Removes an event listener for which the subscription has been created. After calling this function, the listener will no longer receive any events from the emitter.

Returns:
void
ExpoPushToken
Object which contains the Expo push token in the data field. Use the value from data to send notifications via Expo Notifications service.

Property	Type	Description
data	string	
The acquired push token.

type	'expo'	
Always set to "expo".

ExpoPushTokenOptions
Property	Type	Description
applicationId
(optional)
string	
The ID of the application to which the token should be attributed. Defaults to Application.applicationId exposed by expo-application.

baseUrl
(optional)
string	
Endpoint URL override.

development
(optional)
boolean	
Only for: 

On iOS, there are two push notification services: "sandbox" and "production". This defines whether the push token is supposed to be used with the sandbox platform notification service. Defaults to Application.getIosPushNotificationServiceEnvironmentAsync() exposed by expo-application or false. Most probably you won't need to customize that. You may want to customize that if you don't want to install expo-application and still use the sandbox APNs.

deviceId
(optional)
string	
-
devicePushToken
(optional)
DevicePushToken	
The device push token with which to register at the backend. Defaults to a token fetched with getDevicePushTokenAsync().

projectId
(optional)
string	
The ID of the project to which the token should be attributed. Defaults to Constants.expoConfig.extra.eas.projectId exposed by expo-constants.

When using EAS Build, this value is automatically set. However, it is recommended to set it manually. Once you have EAS Build configured, you can find the value in app.json under extra.eas.projectId. You can copy and paste it into your code. If you are not using EAS Build, it will fallback to Constants.expoConfig?.extra?.eas?.projectId.

type
(optional)
string	
Request body override.

url
(optional)
string	
Request URL override.

FirebaseRemoteMessage
A Firebase RemoteMessage that caused the notification to be delivered to the app.

Property	Type	Description
collapseKey	null | string	
-
data	Record<string, string>	
-
from	null | string	
-
messageId	null | string	
-
messageType	null | string	
-
notification	null | FirebaseRemoteMessageNotification	
-
originalPriority	number	
-
priority	number	
-
sentTime	number	
-
to	null | string	
-
ttl	number	
-
FirebaseRemoteMessageNotification
Property	Type	Description
body	null | string	
-
bodyLocalizationArgs	null | string[]	
-
bodyLocalizationKey	null | string	
-
channelId	null | string	
-
clickAction	null | string	
-
color	null | string	
-
eventTime	null | number	
-
icon	null | string	
-
imageUrl	null | string	
-
lightSettings	null | number[]	
-
link	null | string	
-
localOnly	boolean	
-
notificationCount	null | number	
-
notificationPriority	null | number	
-
sound	null | string	
-
sticky	boolean	
-
tag	null | string	
-
ticker	null | string	
-
title	null | string	
-
titleLocalizationArgs	null | string[]	
-
titleLocalizationKey	null | string	
-
usesDefaultLightSettings	boolean	
-
usesDefaultSound	boolean	
-
usesDefaultVibrateSettings	boolean	
-
vibrateTimings	null | number[]	
-
visibility	null | number	
-
IosNotificationPermissionsRequest
Available configuration for permission request on iOS platform. See Apple documentation for UNAuthorizationOptions to learn more.

Property	Type	Description
allowAlert
(optional)
boolean	
The ability to display alerts.

allowBadge
(optional)
boolean	
The ability to update the app’s badge.

allowCriticalAlerts
(optional)
boolean	
The ability to play sounds for critical alerts.

allowDisplayInCarPlay
(optional)
boolean	
The ability to display notifications in a CarPlay environment.

allowProvisional
(optional)
boolean	
The ability to post noninterrupting notifications provisionally to the Notification Center.

allowSound
(optional)
boolean	
The ability to play sounds.

provideAppNotificationSettings
(optional)
boolean	
An option indicating the system should display a button for in-app notification settings.

LocationNotificationTrigger
A trigger related to a UNLocationNotificationTrigger.

Property	Type	Description
region	CircularRegion | BeaconRegion	
-
repeats	boolean	
-
type	'location'	
-
MonthlyNotificationTrigger
A trigger related to a monthly notification.

The same functionality will be achieved on iOS with a CalendarNotificationTrigger.

Property	Type	Description
day	number	
-
hour	number	
-
minute	number	
-
type	'monthly'	
-
NativeDevicePushToken
Property	Type	Description
data	string	
-
type	'ios' | 'android'	
-
Notification
An object which represents a single notification that has been triggered by some request (NotificationRequest) at some point in time.

Property	Type	Description
date	number	
-
request	NotificationRequest	
-
NotificationAction
Property	Type	Description
buttonTitle	string	
The title of the button triggering this action.

identifier	string	
A unique string that identifies this action. If a user takes this action (for example, selects this button in the system's Notification UI), your app will receive this actionIdentifier via the NotificationResponseReceivedListener.

options
(optional)
{
  isAuthenticationRequired: boolean, 
  isDestructive: boolean, 
  opensAppToForeground: boolean
}
Object representing the additional configuration options.

textInput
(optional)
{
  placeholder: string, 
  submitButtonTitle: string
}
Object which, if provided, will result in a button that prompts the user for a text response.

NotificationBehavior
An object which represents behavior that should be applied to the incoming notification. On Android, this influences whether the notification is shown, a sound is played, and priority. On iOS, this maps directly to UNNotificationPresentationOptions.

On Android, setting shouldPlaySound: false will result in the drop-down notification alert not showing, no matter what the priority is. This setting will also override any channel-specific sounds you may have configured.

Property	Type	Description
priority
(optional)
AndroidNotificationPriority	
-
shouldPlaySound	boolean	
-
shouldSetBadge	boolean	
Only for: 

-
shouldShowAlert
(optional)
boolean	
Deprecated instead, specify shouldShowBanner and / or shouldShowList

shouldShowBanner	boolean	
-
shouldShowList	boolean	
-
NotificationCategory
Property	Type	Description
actions	NotificationAction[]	
-
identifier	string	
-
options
(optional)
NotificationCategoryOptions	
-
NotificationChannel
An object which represents a notification channel.

Property	Type	Description
audioAttributes	AudioAttributes	
-
bypassDnd	boolean	
-
description	null | string	
-
enableLights	boolean	
-
enableVibrate	boolean	
-
groupId
(optional)
null | string	
-
id	string	
-
importance	AndroidImportance	
-
lightColor	string	
-
lockscreenVisibility	AndroidNotificationVisibility	
-
name	null | string	
-
showBadge	boolean	
-
sound	null | 'default' | 'custom'	
-
vibrationPattern	null | number[]	
-
NotificationChannelGroup
An object which represents a notification channel group.

Property	Type	Description
channels	NotificationChannel[]	
-
description
(optional)
null | string	
-
id	string	
-
isBlocked
(optional)
boolean	
-
name	null | string	
-
NotificationChannelGroupInput
An object which represents a notification channel group to be set.

Property	Type	Description
description
(optional)
null | string	
-
name	null | string	
-
NotificationChannelGroupManager
Extends: ProxyNativeModule

Property	Type	Description
deleteNotificationChannelGroupAsync
(optional)
(groupId: string) => Promise<void>	
-
getNotificationChannelGroupAsync
(optional)
(groupId: string) => Promise<null | NotificationChannelGroup>	
-
getNotificationChannelGroupsAsync
(optional)
() => Promise<NotificationChannelGroup[]>	
-
setNotificationChannelGroupAsync
(optional)
(groupId: string, group: NotificationChannelGroupInput) => Promise<null | NotificationChannelGroup>	
-
NotificationChannelManager
Extends: ProxyNativeModule

Property	Type	Description
deleteNotificationChannelAsync
(optional)
(channelId: string) => Promise<void>	
-
getNotificationChannelAsync
(optional)
(channelId: string) => Promise<null | NotificationChannel>	
-
getNotificationChannelsAsync
(optional)
() => Promise<null | NotificationChannel[]>	
-
setNotificationChannelAsync
(optional)
(channelId: string, channelConfiguration: NotificationChannelInput) => Promise<null | NotificationChannel>	
-
NotificationHandler
Property	Type	Description
handleError
(optional)
(notificationId: string, error: NotificationHandlingError) => void	
A function called whenever calling handleNotification() for an incoming notification fails.

handleNotification	(notification: Notification) => Promise<NotificationBehavior>	
A function accepting an incoming notification returning a Promise resolving to a behavior (NotificationBehavior) applicable to the notification

handleSuccess
(optional)
(notificationId: string) => void	
A function called whenever an incoming notification is handled successfully.

NotificationPermissionsRequest
An interface representing the permissions request scope configuration. Each option corresponds to a different native platform authorization option.

Property	Type	Description
android
(optional)
object	
On Android, all available permissions are granted by default, and if a user declines any permission, an app cannot prompt the user to change.

ios
(optional)
IosNotificationPermissionsRequest	
Available configuration for permission request on iOS platform.

NotificationPermissionsStatus
Extends: PermissionResponse

An object obtained by permissions get and request functions.

Property	Type	Description
android
(optional)
{
  importance: number, 
  interruptionFilter: number
}
-
ios
(optional)
{
  alertStyle: IosAlertStyle, 
  allowsAlert: null | boolean, 
  allowsAnnouncements: null | boolean, 
  allowsBadge: null | boolean, 
  allowsCriticalAlerts: null | boolean, 
  allowsDisplayInCarPlay: null | boolean, 
  allowsDisplayInNotificationCenter: null | boolean, 
  allowsDisplayOnLockScreen: null | boolean, 
  allowsPreviews: IosAllowsPreviews, 
  allowsSound: null | boolean, 
  providesAppNotificationSettings: boolean, 
  status: IosAuthorizationStatus
}
-
NotificationRequest
An object represents a request to present a notification. It has content — how it's being represented, and a trigger — what triggers the notification. Many notifications (Notification) may be triggered with the same request (for example, a repeating notification).

Property	Type	Description
content	NotificationContent	
-
identifier	string	
-
trigger	NotificationTrigger	
-
NotificationRequestInput
An object which represents a notification request you can pass into scheduleNotificationAsync.

Property	Type	Description
content	NotificationContentInput	
-
identifier
(optional)
string	
-
trigger	NotificationTriggerInput	
-
NotificationResponse
An object which represents user's interaction with the notification.

Note: If the user taps on a notification, actionIdentifier will be equal to Notifications.DEFAULT_ACTION_IDENTIFIER.

Property	Type	Description
actionIdentifier	string	
-
notification	Notification	
-
userText
(optional)
string	
-
Region
The region used to determine when the system sends the notification.

Property	Type	Description
identifier	string	
The identifier for the region object.

notifyOnEntry	boolean	
Indicates whether notifications are generated upon entry into the region.

notifyOnExit	boolean	
Indicates whether notifications are generated upon exit from the region.

type	string	
-
TimeIntervalNotificationTrigger
A trigger related to an elapsed time interval. May be repeating (see repeats field).

Property	Type	Description
repeats	boolean	
-
seconds	number	
-
type	'timeInterval'	
-
UnknownNotificationTrigger
Represents a notification trigger that is unknown to expo-notifications and that it didn't know how to serialize for JS.

Property	Type	Description
type	'unknown'	
-
WeeklyNotificationTrigger
A trigger related to a weekly notification.

The same functionality will be achieved on iOS with a CalendarNotificationTrigger.

Property	Type	Description
hour	number	
-
minute	number	
-
type	'weekly'	
-
weekday	number	
-
YearlyNotificationTrigger
A trigger related to a yearly notification.

The same functionality will be achieved on iOS with a CalendarNotificationTrigger.

Property	Type	Description
day	number	
-
hour	number	
-
minute	number	
-
month	number	
-
type	'yearly'	
-
Types
AudioAttributesInput
Type: Partial<AudioAttributes>

CalendarTriggerInput
This trigger input will cause the notification to be delivered once or many times (controlled by the value of repeats) when the date components match the specified values. Corresponds to native UNCalendarNotificationTrigger.

Property	Type	Description
channelId
(optional)
string	
-
day
(optional)
number	
-
hour
(optional)
number	
-
minute
(optional)
number	
-
month
(optional)
number	
-
repeats
(optional)
boolean	
-
second
(optional)
number	
-
seconds
(optional)
number	
-
timezone
(optional)
string	
-
type	SchedulableTriggerInputTypes.CALENDAR	
-
weekday
(optional)
number	
-
weekdayOrdinal
(optional)
number	
-
weekOfMonth
(optional)
number	
-
weekOfYear
(optional)
number	
-
year
(optional)
number	
-
ChannelAwareTriggerInput
A trigger that will cause the notification to be delivered immediately.

Property	Type	Description
channelId	string	
-
DailyTriggerInput
This trigger input will cause the notification to be delivered once per day when the hour and minute date components match the specified values.

Property	Type	Description
channelId
(optional)
string	
-
hour	number	
-
minute	number	
-
type	SchedulableTriggerInputTypes.DAILY	
-
DateTriggerInput
This trigger input will cause the notification to be delivered once on the specified value of the date property. The value of repeats will be ignored for this trigger type.

Property	Type	Description
channelId
(optional)
string	
-
date	Date | number	
-
type	SchedulableTriggerInputTypes.DATE	
-
DevicePushToken
Literal Type: union

In simple terms, an object of type: Platform.OS and data: any. The data type depends on the environment - on a native device it will be a string, which you can then use to send notifications via Firebase Cloud Messaging (Android) or APNs (iOS).

Acceptable values are: ExplicitlySupportedDevicePushToken | ImplicitlySupportedDevicePushToken

ExplicitlySupportedDevicePushToken
Type: NativeDevicePushToken

ImplicitlySupportedDevicePushToken
Property	Type	Description
data	any	
The push token as a string for a native platform.

type	Exclude<Platform.OS, ExplicitlySupportedDevicePushToken[type]>	
Either android or ios.

MaybeNotificationResponse
Literal Type: union

Acceptable values are: NotificationResponse | null | undefined

MonthlyTriggerInput
This trigger input will cause the notification to be delivered once per month when the day, hour, and minute date components match the specified values.

Note: All properties are specified in JavaScript Date object's ranges (i.e. January is represented as 0).

Property	Type	Description
channelId
(optional)
string	
-
day	number	
-
hour	number	
-
minute	number	
-
type	SchedulableTriggerInputTypes.MONTHLY	
-
NativeNotificationPermissionsRequest
Literal Type: union

Acceptable values are: IosNotificationPermissionsRequest | object

NotificationCategoryOptions
Property	Type	Description
allowAnnouncement
(optional)
boolean	
Deprecated the option is ignored by iOS. This option will be removed in a future release. Indicates whether to allow notifications to be automatically read by Siri when the user is using AirPods.

Default:
false
allowInCarPlay
(optional)
boolean	
Indicates whether to allow CarPlay to display notifications of this type. Apps must be approved for CarPlay to make use of this feature.

Default:
false
categorySummaryFormat
(optional)
string	
A format string for the summary description used when the system groups the category’s notifications.

customDismissAction
(optional)
boolean	
Indicates whether to send actions for handling when the notification is dismissed (the user must explicitly dismiss the notification interface - ignoring a notification or flicking away a notification banner does not trigger this action).

Default:
false
intentIdentifiers
(optional)
string[]	
Array of Intent Class Identifiers. When a notification is delivered, the presence of an intent identifier lets the system know that the notification is potentially related to the handling of a request made through Siri.

Default:
[]
previewPlaceholder
(optional)
string	
Customizable placeholder for the notification preview text. This is shown if the user has disabled notification previews for the app. Defaults to the localized iOS system default placeholder (Notification).

showSubtitle
(optional)
boolean	
Indicates whether to show the notification's subtitle, even if the user has disabled notification previews for the app.

Default:
false
showTitle
(optional)
boolean	
Indicates whether to show the notification's title, even if the user has disabled notification previews for the app.

Default:
false
NotificationChannelInput
Type: RequiredBy<Omit<NotificationChannel, 'id' | 'audioAttributes' | 'sound'> & { audioAttributes: AudioAttributesInput, sound: string | null }, 'name' | 'importance'>

An object which represents a notification channel to be set.

NotificationContent
An object represents notification's content.

Type: NotificationContentIos | NotificationContentAndroid extended by:

Property	Type	Description
body	string | null	
Notification body - the main content of the notification.

categoryIdentifier	string | null	
The identifier of the notification’s category.

data	undefined	
Data associated with the notification, not displayed

sound	'default' | 'defaultCritical' | 'custom' | null	
-
subtitle	string | null	
On Android: subText - the display depends on the device.

On iOS: subtitle - the bold text displayed between title and the rest of the content.

title	string | null	
Notification title - the bold text displayed above the rest of the content.

NotificationContentAndroid
See Android developer documentation for more information on specific fields.

Property	Type	Description
badge
(optional)
number	
Application badge number associated with the notification.

color
(optional)
string	
Accent color (in #AARRGGBB or #RRGGBB format) to be applied by the standard Style templates when presenting this notification.

priority
(optional)
AndroidNotificationPriority	
Relative priority for this notification. Priority is an indication of how much of the user's valuable attention should be consumed by this notification. Low-priority notifications may be hidden from the user in certain situations, while the user might be interrupted for a higher-priority notification. The system will make a determination about how to interpret this priority when presenting the notification.

vibrationPattern
(optional)
number[]	
The pattern with which to vibrate.

NotificationContentAttachmentIos
Property	Type	Description
hideThumbnail
(optional)
boolean	
-
identifier	string | null	
-
thumbnailClipArea
(optional)
{
  height: number, 
  width: number, 
  x: number, 
  y: number
}
-
thumbnailTime
(optional)
number	
-
type	string | null	
-
typeHint
(optional)
string	
-
url	string | null	
-
NotificationContentInput
An object which represents notification content that you pass in as a part of NotificationRequestInput.

Property	Type	Description
attachments
(optional)
NotificationContentAttachmentIos[]	
Only for: 

The visual and audio attachments to display alongside the notification’s main content.

autoDismiss
(optional)
boolean	
Only for: 

If set to false, the notification will not be automatically dismissed when clicked. The setting will be used when the value is not provided or is invalid is set to true, and the notification will be dismissed automatically anyway. Corresponds directly to Android's setAutoCancel behavior.

See Android developer documentation for more details.

badge
(optional)
number	
Application badge number associated with the notification.

body
(optional)
string | null	
The main content of the notification.

categoryIdentifier
(optional)
string	
Only for: 

The identifier of the notification’s category.

color
(optional)
string	
Only for: 

Accent color (in #AARRGGBB or #RRGGBB format) to be applied by the standard Style templates when presenting this notification.

data
(optional)
Record<string, unknown>	
Data associated with the notification, not displayed.

interruptionLevel
(optional)
'passive' | 'active' | 'timeSensitive' | 'critical'	
Only for: 

The notification’s importance and required delivery timing. Possible values:

'passive' - the system adds the notification to the notification list without lighting up the screen or playing a sound
'active' - the system presents the notification immediately, lights up the screen, and can play a sound
'timeSensitive' - The system presents the notification immediately, lights up the screen, can play a sound, and breaks through system notification controls
'critical - the system presents the notification immediately, lights up the screen, and bypasses the mute switch to play a sound
launchImageName
(optional)
string	
The name of the image or storyboard to use when your app launches because of the notification.

priority
(optional)
string	
Only for: 

Relative priority for this notification. Priority is an indication of how much of the user's valuable attention should be consumed by this notification. Low-priority notifications may be hidden from the user in certain situations, while the user might be interrupted for a higher-priority notification. The system will make a determination about how to interpret this priority when presenting the notification.

sound
(optional)
boolean | string	
-
sticky
(optional)
boolean	
Only for: 

If set to true, the notification cannot be dismissed by swipe. This setting defaults to false if not provided or is invalid. Corresponds directly do Android's isOngoing behavior. In Firebase terms this property of a notification is called sticky.

See Android developer documentation and Firebase documentation for more details.

subtitle
(optional)
string | null	
On Android: subText - the display depends on the device.

On iOS: subtitle - the bold text displayed between title and the rest of the content.

title
(optional)
string | null	
Notification title - the bold text displayed above the rest of the content.

vibrate
(optional)
number[]	
Only for: 

The pattern with which to vibrate.

NotificationContentIos
See Apple documentation for more information on specific fields.

Property	Type	Description
attachments	NotificationContentAttachmentIos[]	
The visual and audio attachments to display alongside the notification’s main content.

badge	number | null	
The number that your app’s icon displays.

interruptionLevel
(optional)
'passive' | 'active' | 'timeSensitive' | 'critical'	
Only for: 

The notification’s importance and required delivery timing. Possible values:

'passive' - the system adds the notification to the notification list without lighting up the screen or playing a sound
'active' - the system presents the notification immediately, lights up the screen, and can play a sound
'timeSensitive' - The system presents the notification immediately, lights up the screen, can play a sound, and breaks through system notification controls
'critical - the system presents the notification immediately, lights up the screen, and bypasses the mute switch to play a sound
launchImageName	string | null	
The name of the image or storyboard to use when your app launches because of the notification.

summaryArgument
(optional)
string | null	
The text the system adds to the notification summary to provide additional context.

summaryArgumentCount
(optional)
number	
The number the system adds to the notification summary when the notification represents multiple items.

targetContentIdentifier
(optional)
string	
The value your app uses to determine which scene to display to handle the notification.

threadIdentifier	string | null	
The identifier that groups related notifications.

NotificationHandlingError
Literal Type: union

Acceptable values are: NotificationTimeoutError | Error

NotificationTaskPayload
Payload for the background notification handler task. Read more.

Type: NotificationResponse or object shaped as below:

Property	Type	Description
aps
(optional)
Record<string, unknown>	
Only for: 

Detailed, raw object describing the remote notification. See more.

data	
{
  dataString: string
}
dataString carries the data payload of the notification as JSON string.

notification	Record<string, unknown> | null	
Object describing the remote notification. null for headless background notifications.

NotificationTrigger
Literal Type: union

A union type containing different triggers which may cause the notification to be delivered to the application.

Acceptable values are: PushNotificationTrigger | LocationNotificationTrigger | NotificationTriggerInput | UnknownNotificationTrigger

NotificationTriggerInput
Literal Type: union

A type which represents possible triggers with which you can schedule notifications. A null trigger means that the notification should be scheduled for delivery immediately.

Acceptable values are: null | ChannelAwareTriggerInput | SchedulableNotificationTriggerInput

PermissionExpiration
Literal Type: union

Permission expiration time. Currently, all permissions are granted permanently.

Acceptable values are: 'never' | number

PermissionResponse
An object obtained by permissions get and request functions.

Property	Type	Description
canAskAgain	boolean	
Indicates if user can be asked again for specific permission. If not, one should be directed to the Settings app in order to enable/disable the permission.

expires	PermissionExpiration	
Determines time when the permission expires.

granted	boolean	
A convenience boolean that indicates if the permission is granted.

status	PermissionStatus	
Determines the status of the permission.

PushNotificationTrigger
Property	Type	Description
payload
(optional)
Record<string, unknown>	
Only for: 

-
remoteMessage
(optional)
FirebaseRemoteMessage	
Only for: 

-
type	'push'	
-
PushTokenListener(token)
A function accepting a device push token (DevicePushToken) as an argument.

Note: You should not call getDevicePushTokenAsync inside this function, as it triggers the listener and may lead to an infinite loop.

Parameter	Type
token	DevicePushToken
Returns:
void

RequiredBy
Literal Type: union

Acceptable values are: Partial<Omit<T, K>> | Required<Pick<T, K>>

SchedulableNotificationTriggerInput
Literal Type: union

Input for time-based, schedulable triggers. For these triggers you can check the next trigger date with getNextTriggerDateAsync. If you pass in a number (Unix timestamp) or Date, it will be processed as a trigger input of type SchedulableTriggerInputTypes.DATE. Otherwise, the input must be an object, with a type value set to one of the allowed values in SchedulableTriggerInputTypes. If the input is an object, date components passed in will be validated, and an error is thrown if they are outside their allowed range (for example, the minute and second components must be between 0 and 59 inclusive).

Acceptable values are: CalendarTriggerInput | TimeIntervalTriggerInput | DailyTriggerInput | WeeklyTriggerInput | MonthlyTriggerInput | YearlyTriggerInput | DateTriggerInput

Deprecated use the EventSubscription type instead

Subscription
Type: EventSubscription

TimeIntervalTriggerInput
This trigger input will cause the notification to be delivered once or many times (depends on the repeats field) after seconds time elapse.

On iOS, when repeats is true, the time interval must be 60 seconds or greater. Otherwise, the notification won't be triggered.

Property	Type	Description
channelId
(optional)
string	
-
repeats
(optional)
boolean	
-
seconds	number	
-
type	SchedulableTriggerInputTypes.TIME_INTERVAL	
-
WeeklyTriggerInput
This trigger input will cause the notification to be delivered once every week when the weekday, hour, and minute date components match the specified values.

Note: Weekdays are specified with a number from 1 through 7, with 1 indicating Sunday.

Property	Type	Description
channelId
(optional)
string	
-
hour	number	
-
minute	number	
-
type	SchedulableTriggerInputTypes.WEEKLY	
-
weekday	number	
-
YearlyTriggerInput
This trigger input will cause the notification to be delivered once every year when the day, month, hour, and minute date components match the specified values.

Note: All properties are specified in JavaScript Date object's ranges (i.e. January is represented as 0).

Property	Type	Description
channelId
(optional)
string	
-
day	number	
-
hour	number	
-
minute	number	
-
month	number	
-
type	SchedulableTriggerInputTypes.YEARLY	
-
Enums
AndroidAudioContentType
UNKNOWN
AndroidAudioContentType.UNKNOWN ＝ 0
SPEECH
AndroidAudioContentType.SPEECH ＝ 1
MUSIC
AndroidAudioContentType.MUSIC ＝ 2
MOVIE
AndroidAudioContentType.MOVIE ＝ 3
SONIFICATION

Autolinking
React Native libraries often come with platform-specific (native) code. Autolinking is a mechanism that allows your project to discover and use this code.

Add a library using your favorite package manager and run the build:

# install
yarn add react-native-webview
cd ios && pod install && cd .. # CocoaPods on iOS needs this extra step
# run
yarn react-native run-ios
yarn react-native run-android
That's it. No more editing build config files to use native code.

Also, removing a library is similar to adding a library:

# uninstall
yarn remove react-native-webview
cd ios && pod install && cd .. # CocoaPods on iOS needs this extra step
How does it work
Each platform defines its own platforms configuration. It instructs the CLI on how to find information about native dependencies. This information is exposed through the config command in a JSON format. It's then used by the scripts run by the platform's build tools. Each script applies the logic to link native dependencies specific to its platform.

Platform iOS
The react-native/scripts/react_native_pods.rb script required by Podfile gets the package metadata from react-native config command during install phase and:

Adds dependencies via CocoaPods dev pods (using files from a local path).
Adds build phase scripts to the App project’s build phase. (see examples below)
This means that all libraries need to ship a Podspec in the root of their folder. Podspec references the native code that your library depends on.

The implementation ensures that a library is imported only once. If you need to have a custom pod directive then include it above the use_native_modules! function.

Example
See example usage in React Native template's Podfile.

Platform Android
The autolinkLibrariesWithApp function from React Native Gradle Plugin (RNGP) must be registered in your project's settings.gradle file and called in app/build.gradle file and:

At build time, before the build script is run:
RNGP plugin registered in settings.gradle runs autolinkLibrariesFromCommand() method. It uses the package metadata from react-native config to add Android projects.
Then in app/build.gradle it runs autolinkLibrariesWithApp() method. It creates a list of React Native packages to include in the generated /android/build/generated/rn/src/main/java/com/facebook/react/PackageList.java file.
When the new architecture is turned on, the generateNewArchitectureFiles task is fired, generating /android/build/generated/rn/src/main/jni directory with the following files:
Android-rncli.cmake – creates a list of codegen'd libs. Used by the project's CMakeLists.txt.
rncli.cpp – registers codegen'd Turbo Modules and Fabric component providers. Used by MainApplicationModuleProvider.cpp and MainComponentsRegistry.cpp.
rncli.h - a header file for rncli.cpp.
At runtime, the list of React Native packages generated in step 1.2 is registered by getPackages method of ReactNativeHost in MainApplication.java.
You can optionally pass in an instance of MainPackageConfig when initializing PackageList if you want to override the default configuration of MainReactPackage.
Example
See example usage in React Native template:

settings.gradle
app/build.gradle
MainApplication.java
What do I need to have in my package to make it work?
You’re already using Gradle, so Android support will work by default.

On the iOS side, you will need to ensure you have a Podspec to the root of your repo. The react-native-webview Podspec is a good example of a package.json-driven Podspec. Note that CocoaPods does not support having /s in the name of a dependency, so if you are using scoped packages - you may need to change the name for the Podspec.

Pure C++ libraries
Alternatively, if you have a pure C++ library and don't want to use Gradle, you can still use autolinking. You need to update your react-native.config.js to include the following:

// react-native.config.js
module.exports = {
  dependency: {
    platforms: {
      android: {
        sourceDir: 'path/to/your/c++/code',
        cxxModuleCMakeListsPath: `relative/path/to/CMakeLists.txt`, // This is relative to the sourceDir.
        cxxModuleCMakeListsModuleName: 'MyModule', // This is the name of the CMake target.
        cxxModuleHeaderName: 'MyHeader', // CLI will include this header while linking.
      },
    },
  },
};
How can I customize how autolinking works for my package?
A library can add a react-native.config.js configuration file, which will customize the defaults, example:

// react-native.config.js
module.exports = {
  dependency: {
    platforms: {
      android: null, // disable Android platform, other platforms will still autolink if provided
    },
  },
};
How can I disable autolinking for unsupported library?
During the transition period some packages may not support autolinking on certain platforms. To disable autolinking for a package, update your react-native.config.js's dependencies entry to look like this:

// react-native.config.js
module.exports = {
  dependencies: {
    'some-unsupported-package': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
  },
};
How can I disable autolinking for new architecture (Fabric, TurboModules)?
It happens that packages come with their own linking setup for the new architecture. To disable autolinking in such cases (currently react-native-screens, react-native-safe-area-context, react-native-reanimated, react-native-gesture-handler), update your react-native.config.js's dependencies entry to look like this:

// react-native.config.js
module.exports = {
  dependencies: {
    'fabric-or-tm-library': {
      platforms: {
        android: {
          libraryName: null,
          componentDescriptors: null,
          cmakeListsPath: null,
          cxxModuleCMakeListsModuleName: null,
          cxxModuleCMakeListsPath: null,
          cxxModuleHeaderName: null,
        },
      },
    },
  },
};
How can I autolink a local library?
We can leverage CLI configuration to make it "see" React Native libraries that are not part of our 3rd party dependencies. To do so, update your react-native.config.js's dependencies entry to look like this:

// react-native.config.js
module.exports = {
  dependencies: {
    'local-rn-library': {
      root: path.join(__dirname, '/path/to/local-rn-library'),
    },
  },
};
Note: In the root field, it's recommended to use __dirname instead of process.cwd(). This ensures the path is consistently resolved, regardless of the current working directory.

How can I use autolinking in a monorepo?
There is nothing extra you need to do - monorepos are supported by default.

Dependencies are only linked if they are listed in the package.json of the mobile workspace, where "react-native" dependency is defined. For example, with this file structure:

/root
  /packages
    /mobile
      /ios
      /android
      package.json <-- Only dependencies listed here are auto-linked
    /components
      package.json <-- Dependencies here are ignored when auto-linking
  package.json
In this example, if you add a package with native code as a dependency of components, you need to also add it as a dependency of mobile for auto-linking to work.
npm install @react-native-async-storage/async-storage


npx expo install @react-native-community/datetimepicker


react-native-svg


A library that allows using SVGs in your app.

Bundled version:
15.12.1
react-native-svg allows you to use SVGs in your app, with support for interactivity and animation.

Installation
Terminal

Copy

npx expo install react-native-svg
If you are installing this in an existing React Native app, make sure to install expo in your project. Then, follow the installation instructions provided in the library's README or documentation.

API
import * as Svg from 'react-native-svg';
Svg
A set of drawing primitives such as Circle, Rect, Path, ClipPath, and Polygon. It supports most SVG elements and properties. The implementation is provided by react-native-svg, and documentation is provided in that repository.

SVG

Copy


Open in Snack


import Svg, { Circle, Rect } from 'react-native-svg';

export default function SvgComponent(props) {
  return (
    <Svg height="50%" width="50%" viewBox="0 0 100 100" {...props}>
      <Circle cx="50" cy="50" r="45" stroke="blue" strokeWidth="2.5" fill="green" />
      <Rect x="15" y="15" width="70" height="70" stroke="red" strokeWidth="2" fill="yellow" />
    </Svg>
  );
}


react-native-maps


A library that provides a Map component that uses Google Maps on Android and Apple Maps or Google Maps on iOS.

Bundled version:
1.20.1
react-native-maps provides a Map component that uses Google Maps on Android and Apple Maps or Google Maps on iOS.

No additional setup is required when testing your project using Expo Go. However, to deploy the app binary on app stores additional steps are required for Google Maps. For more information, see the instructions below.

Installation
Terminal

Copy

npx expo install react-native-maps
If you are installing this in an existing React Native app, make sure to install expo in your project. Then, follow the installation instructions provided in the library's README or documentation.

Usage
See full documentation at react-native-maps/react-native-maps.

MapView

Copy


Open in Snack


import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
Deploy app with Google Maps
Android
If you have already registered a project for another Google service on Android, such as Google Sign In, you enable the Maps SDK for Android on your project and jump to step 4.

1

Register a Google Cloud API project and enable the Maps SDK for Android
Open your browser to the Google API Manager and create a project.
Once it's created, go to the project and enable the Maps SDK for Android.
2

Copy your app's SHA-1 certificate fingerprint

For Google Play Store


For development builds

If you are deploying your app to the Google Play Store, you'll need to upload your app binary to Google Play console at least once. This is required for Google to generate your app signing credentials.
Go to the Google Play Console > (your app) > Release > Setup > App integrity > App Signing.
Copy the value of SHA-1 certificate fingerprint.
3

Create an API key
Go to Google Cloud Credential manager and click Create Credentials, then API Key.
In the modal, click Edit API key.
Under Key restrictions > Application restrictions, choose Android apps.
Under Restrict usage to your Android apps, click Add an item.
Add your android.package from app.json (for example: com.company.myapp) to the package name field.
Then, add the SHA-1 certificate fingerprint's value from step 2.
Click Done and then click Save.
4

Add the API key to your project
Since you are using Google as the map provider, you need to add the API key to the react-native-maps config plugin. Copy your API Key into your project to either a .env file or copy it directly and then add it to your app config under the plugins.react-native-maps.androidGoogleMapsApiKey field like:

app.json

Copy


{
  "expo": {
    "plugins": [
      [
        "react-native-maps",
        {
          "androidGoogleMapsApiKey": "process.env.YOUR_GOOGLE_MAPS_API_KEY"
        }
      ]
    ]
  }
}
In your code, import { PROVIDER_GOOGLE } from react-native-maps and add the property provider={PROVIDER_GOOGLE} to your <MapView>. This property works on both Android and iOS.
Rebuild the app binary (or re-submit to the Google Play Store in case your app is already uploaded). An easy way to test if the configuration was successful is to do an emulator build.
iOS
If you have already registered a project for another Google service on iOS, such as Google Sign In, you enable the Maps SDK for iOS on your project and jump to step 3.

1

Register a Google Cloud API project and enable the Maps SDK for iOS
Open your browser to the Google API Manager and create a project.
Then, go to the project, click Enable APIs and Services and enable the Maps SDK for iOS.
2

Create an API key
Go to Google Cloud Credential manager and click Create Credentials, then API Key.
In the modal, click Edit API key.
Under Key restrictions > Application restrictions, choose iOS apps.
Under Accept requests from an iOS application with one of these bundle identifiers, click the Add an item button.
Add your ios.bundleIdentifier from app.json (for example: com.company.myapp) to the bundle ID field.
Click Done and then click Save.
3

Add the API key to your project
Since you are using Google as the map provider, you need to add the API key to the react-native-maps config plugin. Copy your API Key into your project to either a .env file or copy it directly and then add it to your app config under the plugins.react-native-maps.iosGoogleMapsApiKey field like:

app.json

Copy


{
  "expo": {
    "plugins": [
      [
        "react-native-maps",
        {
          "iosGoogleMapsApiKey": "process.env.YOUR_GOOGLE_MAPS_API_KEY"
        }
      ]
    ]
  }
}
In your code, import { PROVIDER_GOOGLE } from react-native-maps and add the property provider={PROVIDER_GOOGLE} to your <MapView>. This property works on both Android and iOS.
Rebuild the app binary. An easy way to test if the configuration was successful is to do a simulator build.
Previous (Third-party libraries)

react-native-keyboard-controller

npx expo install react-native-svg

react-native-safe-area-context


A library with a flexible API for accessing the device's safe area inset information.

Bundled version:
~5.6.0
react-native-safe-area-context provides a flexible API for accessing device safe area inset information. This allows you to position your content appropriately around notches, status bars, home indicators, and other such device and operating system interface elements. It also provides a SafeAreaView component that you can use in place of View to automatically inset your views to account for safe areas.

Installation
Terminal

Copy

npx expo install react-native-safe-area-context
If you are installing this in an existing React Native app, make sure to install expo in your project. Then, follow the installation instructions provided in the library's README or documentation.

API
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
Components
SafeAreaView
SafeAreaView is a regular View component with the safe area edges applied as padding.

If you set your own padding on the view, it will be added to the padding from the safe area.

If you are targeting web, you must set up SafeAreaProvider as described in the Context section.
import { SafeAreaView } from 'react-native-safe-area-context';

function SomeComponent() {
  return (
    <SafeAreaView>
      <View />
    </SafeAreaView>
  );
}
SafeAreaView Props

edges
Optional • Type: Edge[] • Default: ["top", "right", "bottom", "left"]


Sets the edges to apply the safe area insets to.

emulateUnlessSupported
Optional • Type: boolean • Default: true



On iOS 10+, emulate the safe area using the status bar height and home indicator sizes.

Hooks
useSafeAreaInsets()
Hook gives you direct access to the safe area insets. This is a more advanced use-case, and might perform worse than SafeAreaView when rotating the device.

Example

import { useSafeAreaInsets } from 'react-native-safe-area-context';

function HookComponent() {
  const insets = useSafeAreaInsets();

  return <View style={{ paddingTop: insets.top }} />;
}
Returns

EdgeInsets

Types
Edge
String union of possible edges.

Acceptable values are: 'top', 'right', 'bottom', 'left'.

EdgeInsets
Represent the hook result.

EdgeInsets Properties

Name	Type	Description
bottom	number	Value of bottom inset.
left	number	Value of left inset.
right	number	Value of right inset.
top	number	Value of top inset.
Guides
Context
To use safe area context, you need to add SafeAreaProvider in your app root component.

You may need to add it in other places too, including at the root of any modals any routes when using react-native-screen.

import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return <SafeAreaProvider>...</SafeAreaProvider>;
}
Then, you can use useSafeAreaInsets() hook and also consumer API to access inset data:

import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

function Component() {
  return (
    <SafeAreaInsetsContext.Consumer>
      {insets => <View style={{ paddingTop: insets.top }} />}
    </SafeAreaInsetsContext.Consumer>
  );
}
Optimization
If you can, use SafeAreaView. It's implemented natively so when rotating the device, there is no delay from the asynchronous bridge.

To speed up the initial render, you can import initialWindowMetrics from this package and set as the initialMetrics prop on the provider as described in Web SSR. You cannot do this if your provider remounts, or you are using react-native-navigation.

import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

function App() {
  return <SafeAreaProvider initialMetrics={initialWindowMetrics}>...</SafeAreaProvider>;
}
Web SSR
If you are doing server side rendering on the web, you can use initialSafeAreaInsets to inject values based on the device the user has, or simply pass zero. Otherwise, insets measurement will break rendering your page content since it is async.

Migrating from CSS
Before
In a web-only app, you would use CSS environment variables to get the size of the screen's safe area insets.

styles.css

Copy


div {
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-bottom: env(safe-area-inset-bottom);
  padding-right: env(safe-area-inset-right);
}
After
Universally, the hook useSafeAreaInsets() can provide access to this information.

App.js

Copy


import { useSafeAreaInsets } from 'react-native-safe-area-context';

function App() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingBottom: insets.bottom,
        paddingRight: insets.right,
      }}
    />
  );
}

react-native-screens


A library that provides native primitives to represent screens for better operating system behavior and screen optimizations.

Bundled version:
~4.16.0
react-native-screens provides native primitives to represent screens instead of plain <View> components To better take advantage of operating system behavior and optimizations around screens. This capability is used by library authors and is unlikely to be used directly by most app developers. It also provides the native components needed for React Navigation's createNativeStackNavigator.

Installation
Terminal

Copy

npx expo install react-native-screens
If you are installing this in an existing React Native app, make sure to install expo in your project. Then, follow the installation instructions provided in the library's README or documentation.

react-native-view-shot


A library that allows you to capture a React Native view and save it as an image.

Bundled version:
4.0.3
Given a view, captureRef will essentially screenshot that view and return an image for you. This is very useful for things like signature pads, where the user draws something, and then you want to save an image from it.

If you're interested in taking snapshots from the GLView, we recommend you use GLView's takeSnapshotAsync instead.

Installation
Terminal

Copy

npx expo install react-native-view-shot
If you are installing this in an existing React Native app, make sure to install expo in your project. Then, follow the installation instructions provided in the library's README or documentation.

Note on pixel values
Remember to take the device PixelRatio into account. When you work with pixel values in a UI, most of the time those units are "logical pixels" or "device-independent pixels". With images like PNG files, you often work with "physical pixels". You can get the PixelRatio of the device using the React Native API: PixelRatio.get()

For example, to save a 'FullHD' picture of 1080x1080, you would do something like this:

const targetPixelCount = 1080; // If you want full HD pictures
const pixelRatio = PixelRatio.get(); // The pixel ratio of the device
// pixels * pixelRatio = targetPixelCount, so pixels = targetPixelCount / pixelRatio
const pixels = targetPixelCount / pixelRatio;

const result = await captureRef(this.imageContainer, {
  result: 'tmpfile',
  height: pixels,
  width: pixels,
  quality: 1,
  format: 'png',
});

react-native-webview


A library that provides a WebView component.

Bundled version:
13.15.0
react-native-webview provides a WebView component that renders web content in a native view.

Installation
Terminal

Copy

npx expo install react-native-webview
If you are installing this in an existing React Native app, make sure to install expo in your project. Then, follow the installation instructions provided in the library's README or documentation.

Usage
Basic Webview usage

Copy


Open in Snack


import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <WebView
      style={styles.container}
      source={{ uri: 'https://expo.dev' }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
With inline HTML
Webview inline HTML

Copy


Open in Snack


import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <WebView
      style={styles.container}
      originWhitelist={['*']}
      source={{ html: '<h1><center>Hello world</center></h1>' }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});

@shopify/flash-list


A React Native component that provides a fast and performant way to render lists.

Bundled version:
2.0.2
@shopify/flash-list is a "Fast and performant React Native list" component that is a drop-in replacement for React Native's <FlatList> component. It "recycles components under the hood to maximize performance."

Installation
Terminal

Copy

npx expo install @shopify/flash-list
If you are installing this in an existing React Native app, make sure to install expo in your project. Then, follow the installation instructions provided in the library's README or documentation.


Expo DeviceMotion



A library that provides access to a device's motion and orientation sensors.

Bundled version:
~15.0.6
DeviceMotion from expo-sensors provides access to the device motion and orientation sensors. All data is presented in terms of three axes that run through a device. According to portrait orientation: X runs from left to right, Y from bottom to top and Z perpendicularly through the screen from back to front.

Installation
Terminal

Copy

npx expo install expo-sensors
If you are installing this in an existing React Native app, make sure to install expo in your project.

Configuration in app config
You can configure DeviceMotion from expo-sensor using its built-in config plugin if you use config plugins in your project (EAS Build or npx expo run:[android|ios]). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect.

Example app.json with config plugin
app.json

Copy


{
  "expo": {
    "plugins": [
      [
        "expo-sensors",
        {
          "motionPermission": "Allow $(PRODUCT_NAME) to access your device motion."
        }
      ]
    ]
  }
}
Configurable properties
Name	Default	Description
motionPermission	"Allow $(PRODUCT_NAME) to access your device motion"	
Only for: 

A string to set the NSMotionUsageDescription permission message.

Are you using this library in an existing React Native app?


API
import { DeviceMotion } from 'expo-sensors';
Constants
Gravity
Type: number

Constant value representing standard gravitational acceleration for Earth (9.80665 m/s^2).

Classes
DeviceMotion
Type: Class extends DeviceSensor<DeviceMotionMeasurement>

A base class for subscribable sensors. The events emitted by this class are measurements specified by the parameter type Measurement.

DeviceMotion Properties

Gravity
Type: number • Default: ExponentDeviceMotion.Gravity
Constant value representing standard gravitational acceleration for Earth (9.80665 m/s^2).

DeviceMotion Methods

addListener(listener)
Parameter	Type	Description
listener	Listener<DeviceMotionMeasurement>	
A callback that is invoked when a device motion sensor update is available. When invoked, the listener is provided a single argument that is a DeviceMotionMeasurement object.


Subscribe for updates to the device motion sensor.

Returns:
EventSubscription
A subscription that you can call remove() on when you would like to unsubscribe the listener.

getListenerCount()
Returns the registered listeners count.

Returns:
number
getPermissionsAsync()
Checks user's permissions for accessing sensor.

Returns:
Promise<PermissionResponse>
hasListeners()
Returns boolean which signifies if sensor has any listeners registered.

Returns:
boolean
isAvailableAsync()
You should always check the sensor availability before attempting to use it.
Returns whether the accelerometer is enabled on the device.

On mobile web, you must first invoke DeviceMotion.requestPermissionsAsync() in a user interaction (i.e. touch event) before you can use this module. If the status is not equal to granted then you should inform the end user that they may have to open settings.

On web this starts a timer and waits to see if an event is fired. This should predict if the iOS device has the device orientation API disabled in Settings > Safari > Motion & Orientation Access. Some devices will also not fire if the site isn't hosted with HTTPS as DeviceMotion is now considered a secure API. There is no formal API for detecting the status of DeviceMotion so this API can sometimes be unreliable on web.

Returns:
Promise<boolean>
A promise that resolves to a boolean denoting the availability of device motion sensor.

removeAllListeners()
Removes all registered listeners.

Returns:
void
removeSubscription(subscription)
Parameter	Type	Description
subscription	EventSubscription	
A subscription to remove.


Removes the given subscription.

Returns:
void
requestPermissionsAsync()
Asks the user to grant permissions for accessing sensor.

Returns:
Promise<PermissionResponse>
setUpdateInterval(intervalMs)
Parameter	Type	Description
intervalMs	number	
Desired interval in milliseconds between sensor updates.

Starting from Android 12 (API level 31), the system has a 200ms limit for each sensor updates.

If you need an update interval less than 200ms, you should:

add android.permission.HIGH_SAMPLING_RATE_SENSORS to app.json permissions field
or if you are using bare workflow, add <uses-permission android:name="android.permission.HIGH_SAMPLING_RATE_SENSORS"/> to AndroidManifest.xml.

Set the sensor update interval.

Returns:
void
Interfaces
Subscription
A subscription object that allows to conveniently remove an event listener from the emitter.

Subscription Methods

remove()
Removes an event listener for which the subscription has been created. After calling this function, the listener will no longer receive any events from the emitter.

Returns:
void
Types
DeviceMotionMeasurement
Property	Type	Description
acceleration	
null | {
  timestamp: number, 
  x: number, 
  y: number, 
  z: number
}
Device acceleration on the three axis as an object with x, y, z keys. Expressed in meters per second squared (m/s^2).

accelerationIncludingGravity	
{
  timestamp: number, 
  x: number, 
  y: number, 
  z: number
}
Device acceleration with the effect of gravity on the three axis as an object with x, y, z keys. Expressed in meters per second squared (m/s^2).

interval	number	
Interval at which data is obtained from the native platform. Expressed in milliseconds (ms).

orientation	DeviceMotionOrientation	
Device orientation based on screen rotation. Value is one of:

0 (portrait),
90 (right landscape),
180 (upside down),
-90 (left landscape).
rotation	
{
  alpha: number, 
  beta: number, 
  gamma: number, 
  timestamp: number
}
Device's orientation in space as an object with alpha, beta, gamma keys where alpha is for rotation around Z axis, beta for X axis rotation and gamma for Y axis rotation.

rotationRate	
null | {
  alpha: number, 
  beta: number, 
  gamma: number, 
  timestamp: number
}
Device's rate of rotation in space expressed in degrees per second (deg/s).

PermissionExpiration
Literal Type: union

Permission expiration time. Currently, all permissions are granted permanently.

Acceptable values are: 'never' | number

PermissionResponse
An object obtained by permissions get and request functions.

Property	Type	Description
canAskAgain	boolean	
Indicates if user can be asked again for specific permission. If not, one should be directed to the Settings app in order to enable/disable the permission.

expires	PermissionExpiration	
Determines time when the permission expires.

granted	boolean	
A convenience boolean that indicates if the permission is granted.

status	PermissionStatus	
Determines the status of the permission.

Enums
DeviceMotionOrientation
LeftLandscape
DeviceMotionOrientation.LeftLandscape ＝ -90
Portrait
DeviceMotionOrientation.Portrait ＝ 0
RightLandscape
DeviceMotionOrientation.RightLandscape ＝ 90
UpsideDown
DeviceMotionOrientation.UpsideDown ＝ 180
PermissionStatus
DENIED
PermissionStatus.DENIED ＝ "denied"
User has denied the permission.

GRANTED
PermissionStatus.GRANTED ＝ "granted"
User has granted the permission.

UNDETERMINED
PermissionStatus.UNDETERMINED ＝ "undetermined"
User hasn't granted or denied the permission yet.

Expo ScreenCapture



A library that allows you to protect screens in your app from being captured or recorded.

Bundled version:
~8.0.6
expo-screen-capture allows you to protect screens in your app from being captured or recorded, as well as be notified if a screenshot is taken while your app is foregrounded. The two most common reasons you may want to prevent screen capture are:

If a screen is displaying sensitive information (password, credit card data, and so on)
You are displaying paid content that you don't want to be recorded and shared
This is especially important on Android since the android.media.projection API allows third-party apps to perform screen capture or screen sharing (even if the app is in the background).

On Android, the screen capture callback works without additional permissions only for Android 14+. You don't need to request or check permissions for blocking screen capture or using the callback on Android 14+.

If you want to use the screen capture callback on Android 13 or lower, you need to add the READ_MEDIA_IMAGES permission to your AndroidManifest.xml file. You can use the android.permissions key in your app config. See Android permissions for more information.

The READ_MEDIA_IMAGES permission can be added only for apps needing broad access to photos. See Details on Google Play's Photo and Video Permissions policy.
Currently, taking screenshots on iOS cannot be prevented. This is due to underlying OS limitations.
For testing screen capture functionality: On Android Emulator, run adb shell input keyevent 120 in a separate terminal to trigger a screenshot. On iOS Simulator, you can trigger screenshots using Device > Trigger Screenshot from the menu bar.
Installation
Terminal

Copy

npx expo install expo-screen-capture
If you are installing this in an existing React Native app, make sure to install expo in your project.

Usage
Example: hook
Screen Capture hook

Copy


Open in Snack


import { usePreventScreenCapture } from 'expo-screen-capture';
import { Text, View } from 'react-native';

export default function ScreenCaptureExample() {
  usePreventScreenCapture();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>As long as this component is mounted, this screen is unrecordable!</Text>
    </View>
  );
}
Example: Blocking screen capture imperatively
Blocking screen capture

Copy


Open in Snack


import * as ScreenCapture from 'expo-screen-capture';
import { useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';

export default function ScreenCaptureExample() {
  const activate = async () => {
    await ScreenCapture.preventScreenCaptureAsync();
  };

  const deactivate = async () => {
    await ScreenCapture.allowScreenCaptureAsync();
  };

  return (
    <View style={styles.container}>
      <Button title="Activate" onPress={activate} />
      <Button title="Deactivate" onPress={deactivate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Show More
Example: Callback for screen capture
Callback for screen capture

Copy


Open in Snack


import * as ScreenCapture from 'expo-screen-capture';
import { useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';

export default function useScreenCaptureCallback() {
  // Only use this if you add the READ_MEDIA_IMAGES permission to your AndroidManifest.xml
  const hasPermissions = async () => {
    const { status } = await ScreenCapture.requestPermissionsAsync();
    return status === 'granted';
  };

  useEffect(() => {
    let subscription;

    const addListenerAsync = async () => {
      if (await hasPermissions()) {
        subscription = ScreenCapture.addScreenshotListener(() => {
          alert('Thanks for screenshotting my beautiful app 😊');
        });
      } else {
        console.error('Permissions needed to subscribe to screenshot events are missing!');
      }
    };
    addListenerAsync();

    return () => {
      subscription?.remove();
    };
  }, []);
}

Show More
API
import * as ScreenCapture from 'expo-screen-capture';
Hooks
usePermissions(options)
Parameter	Type
options
(optional)
PermissionHookOptions<object>

Check or request permissions necessary for detecting when a screenshot is taken. This uses both requestPermissionsAsync and getPermissionsAsync to interact with the permissions.

Returns:
[null | PermissionResponse, RequestPermissionMethod<PermissionResponse>, GetPermissionMethod<PermissionResponse>]
Example

const [status, requestPermission] = ScreenCapture.usePermissions();
usePreventScreenCapture(key)
Parameter	Type	Description
key
(optional)
string	
If provided, this will prevent multiple instances of this hook or the preventScreenCaptureAsync and allowScreenCaptureAsync methods from conflicting with each other. This argument is useful if you have multiple active components using the allowScreenCaptureAsync hook.

Default:
'default'

A React hook to prevent screen capturing for as long as the owner component is mounted.

Returns:
void
useScreenshotListener(listener)
Parameter	Type	Description
listener	() => void	
A function that will be called whenever a screenshot is detected.

This hook automatically starts listening when the component mounts, and stops listening when the component unmounts.


A React hook that listens for screenshots taken while the component is mounted.

Returns:
void
Methods
ScreenCapture.allowScreenCaptureAsync(key)
Parameter	Type	Description
key
(optional)
string	
This will prevent multiple instances of the preventScreenCaptureAsync and allowScreenCaptureAsync methods from conflicting with each other. If provided, the value must be the same as the key passed to preventScreenCaptureAsync in order to re-enable screen capturing.

Default:
'default'

Re-allows the user to screen record or screenshot your app. If you haven't called preventScreenCapture() yet, this method does nothing.

Returns:
Promise<void>
ScreenCapture.disableAppSwitcherProtectionAsync()
Disables the privacy protection overlay that was previously enabled with enableAppSwitcherProtectionAsync.

Returns:
Promise<void>
ScreenCapture.enableAppSwitcherProtectionAsync(blurIntensity)
Parameter	Type	Description
blurIntensity
(optional)
number	
The intensity of the blur effect, from 0.0 (no blur) to 1.0 (maximum blur). Default is 0.5.

Default:
0.5

Enables a privacy protection blur overlay that hides sensitive content when the app is not in focus. The overlay applies a customizable blur effect when the app is in the app switcher, background, or during interruptions (calls, Siri, Control Center, etc.), and automatically removes it when the app becomes active again.

This provides visual privacy protection by preventing sensitive app content from being visible in:

App switcher previews
Background app snapshots
Screenshots taken during inactive states
For Android, app switcher protection is automatically provided by preventScreenCaptureAsync() using the FLAG_SECURE window flag, which shows a blank screen in the recent apps preview.

Returns:
Promise<void>
ScreenCapture.getPermissionsAsync()
Checks user's permissions for detecting when a screenshot is taken.

Only Android requires additional permissions to detect screenshots. On iOS devices, this method will always resolve to a granted permission response.

Returns:
Promise<PermissionResponse>
A promise that resolves to a PermissionResponse object.

ScreenCapture.isAvailableAsync()
Returns whether the Screen Capture API is available on the current device.

Returns:
Promise<boolean>
A promise that resolves to a boolean indicating whether the Screen Capture API is available on the current device.

ScreenCapture.preventScreenCaptureAsync(key)
Parameter	Type	Description
key
(optional)
string	
Optional. If provided, this will help prevent multiple instances of the preventScreenCaptureAsync and allowScreenCaptureAsync methods (and usePreventScreenCapture hook) from conflicting with each other. When using multiple keys, you'll have to re-allow each one in order to re-enable screen capturing.

Default:
'default'

Prevents screenshots and screen recordings until allowScreenCaptureAsync is called or the app is restarted. If you are already preventing screen capture, this method does nothing (unless you pass a new and unique key).

On iOS, this prevents screen recordings and screenshots, and is only available on iOS 11+ (recordings) and iOS 13+ (screenshots). On older iOS versions, this method does nothing.

Returns:
Promise<void>
ScreenCapture.requestPermissionsAsync()
Asks the user to grant permissions necessary for detecting when a screenshot is taken.

Only Android requires additional permissions to detect screenshots. On iOS devices, this method will always resolve to a granted permission response.

Returns:
Promise<PermissionResponse>
A promise that resolves to a PermissionResponse object.

Event Subscriptions
ScreenCapture.addScreenshotListener(listener)
Parameter	Type	Description
listener	() => void	
The function that will be executed when the user takes a screenshot. This function accepts no arguments.


Adds a listener that will fire whenever the user takes a screenshot while the app is foregrounded.

Permission requirements for this method depend on your device’s Android version:

Before Android 13: Requires READ_EXTERNAL_STORAGE.
Android 13: Switches to READ_MEDIA_IMAGES.
Post-Android 13: No additional permissions required. You can request the appropriate permissions by using MediaLibrary.requestPermissionsAsync().
Returns:
EventSubscription
A Subscription object that you can use to unregister the listener, either by calling remove() or passing it to removeScreenshotListener.

ScreenCapture.removeScreenshotListener(subscription)
Parameter	Type	Description
subscription	EventSubscription	
Subscription returned by addScreenshotListener.


Removes the subscription you provide, so that you are no longer listening for screenshots. You can also call remove() on that Subscription object.

Returns:
void
Example

let mySubscription = addScreenshotListener(() => {
  console.log("You took a screenshot!");
});
...
mySubscription.remove();
// OR
removeScreenshotListener(mySubscription);
ScreenCapture.useScreenshotListener(listener)
Parameter	Type	Description
listener	() => void	
A function that will be called whenever a screenshot is detected.

This hook automatically starts listening when the component mounts, and stops listening when the component unmounts.


A React hook that listens for screenshots taken while the component is mounted.

Returns:
void
Interfaces
Subscription
A subscription object that allows to conveniently remove an event listener from the emitter.

Subscription Methods

remove()
Removes an event listener for which the subscription has been created. After calling this function, the listener will no longer receive any events from the emitter.

Returns:
void
Types
PermissionHookOptions
Literal Type: union

Acceptable values are: PermissionHookBehavior | Options

PermissionResponse
An object obtained by permissions get and request functions.

Property	Type	Description
canAskAgain	boolean	
Indicates if user can be asked again for specific permission. If not, one should be directed to the Settings app in order to enable/disable the permission.

expires	PermissionExpiration	
Determines time when the permission expires.

granted	boolean	
A convenience boolean that indicates if the permission is granted.

status	PermissionStatus	
Determines the status of the permission.

Enums
PermissionStatus
DENIED
PermissionStatus.DENIED ＝ "denied"
User has denied the permission.

GRANTED
PermissionStatus.GRANTED ＝ "granted"
User has granted the permission.

UNDETERMINED
PermissionStatus.UNDETERMINED ＝ "undetermined"
User hasn't granted or denied the permission yet.

Expo Location



A library that provides access to reading geolocation information, polling current location or subscribing location update events from the device.

Bundled version:
~19.0.6
expo-location allows reading geolocation information from the device. Your app can poll for the current location or subscribe to location update events.

Installation
Terminal

Copy

npx expo install expo-location
If you are installing this in an existing React Native app, make sure to install expo in your project.

Configuration in app config
You can configure expo-location using its built-in config plugin if you use config plugins in your project (EAS Build or npx expo run:[android|ios]). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect.

Example app.json with config plugin
app.json

Copy


{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
        }
      ]
    ]
  }
}
Configurable properties
Name	Default	Description
locationAlwaysAndWhenInUsePermission	"Allow $(PRODUCT_NAME) to use your location"	
Only for: 

A string to set the NSLocationAlwaysAndWhenInUseUsageDescription permission message.

locationAlwaysPermission	"Allow $(PRODUCT_NAME) to use your location"	
 • 
Only for: 

A string to set the NSLocationAlwaysUsageDescription permission message.

locationWhenInUsePermission	"Allow $(PRODUCT_NAME) to use your location"	
Only for: 

A string to set the NSLocationWhenInUseUsageDescription permission message.

isIosBackgroundLocationEnabled	false	
Only for: 

A boolean to enable location in the UIBackgroundModes in Info.plist.

isAndroidBackgroundLocationEnabled	false	
Only for: 

A boolean to enable the ACCESS_BACKGROUND_LOCATION permission.

isAndroidForegroundServiceEnabled	-	
Only for: 

A boolean to enable the FOREGROUND_SERVICE permission and FOREGROUND_SERVICE_LOCATION. Defaults to true if isAndroidBackgroundLocationEnabled is true, otherwise false.

Are you using this library in an existing React Native app?

Background location
Background location allows your app to receive location updates while it is running in the background and includes both location updates and region monitoring through geofencing. This feature is subject to platform API limitations and system constraints:

Background location will stop if the user terminates the app.
Background location resumes if the user restarts the app.
 A terminated app will not automatically restart when a location or geofencing event occurs due to platform limitations.
 The system will restart the terminated app when a new geofence event occurs.
On Android, the result of removing an app from the recent apps list varies by device vendor. For example, some implementations treat removing an app from the recent apps list as killing it. Read more about these differences here: https://dontkillmyapp.com.
Background location configuration 
To be able to run background location on iOS, you need to add the location value to the UIBackgroundModes array in your app's Info.plist file.

If you're using CNG, the required UIBackgroundModes configuration will be applied automatically by prebuild.

Configure UIBackgroundModes manually on iOS


Background location methods
To use Background Location methods, the following requirements apply:

Location permissions must be granted.
Background location task must be defined in the top-level scope, using TaskManager.defineTask.
"location" background mode must be specified in Info.plist file. See Background location configuration.
You must use a development build to use background location since it is not supported in the Expo Go app.
Geofencing methods
To use Geofencing methods, the following requirements apply:

Location permissions must be granted.
The Geofencing task must be defined in the top-level scope, using TaskManager.defineTask.
When using Geofencing, the following platform differences apply:

 You are allowed up to 100 active geofences per app.
 Expo Location will report the initial state of the registered geofence(s) at app startup.
 There is a limit of 20 regions that can be simultaneously monitored.
Background permissions
To use location tracking or Geofencing in the background, you must request the appropriate permissions:

On Android, you must request both foreground and background permissions.
On iOS, it must be granted with the Always option using requestBackgroundPermissionsAsync.
Expo and iOS permissions












Deferred locations
When using background locations, you can configure the location manager to defer updates. This helps save battery by reducing update frequency. You can set updates to trigger only after the device has moved a certain distance or after a specified time interval.

Deferred updates are configured through LocationTaskOptions using the deferredUpdatesDistance, deferredUpdatesInterval and deferredTimeout properties.

Deferred locations apply only when the app is in the background.

Usage
If you're using the Android Emulator or iOS Simulator, ensure that Location is enabled.

Location

Copy


Open in Snack


import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';

import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});

Show More
Enable emulator location
Android Emulator
Open Android Studio, and launch the Android Emulator. Inside it, go to Settings > Location and enable Use location.

Location settings in Android Emulator for versions 12 and higher
If you don't receive the locations in the emulator, you may have to turn off the Improve Location Accuracy setting. This will turn off Wi-Fi location and only use GPS. Then you can manipulate the location with GPS data through the emulator.

For Android 12 and higher, go to Settings > Location > Location Services > Google Location Accuracy, and turn off Improve Location Accuracy. For Android 11 and lower, go to Settings > Location > Advanced > Google Location Accuracy, and turn off Google Location Accuracy.

iOS Simulator
With Simulator open, go to Features > Location and choose any option besides None.

Location settings in iOS simulator.
API
import * as Location from 'expo-location';
Hooks
useBackgroundPermissions(options)
Parameter	Type
options
(optional)
PermissionHookOptions<object>

Check or request permissions for the background location. This uses both requestBackgroundPermissionsAsync and getBackgroundPermissionsAsync to interact with the permissions.

Returns:
[null | PermissionResponse, RequestPermissionMethod<PermissionResponse>, GetPermissionMethod<PermissionResponse>]
Example

const [status, requestPermission] = Location.useBackgroundPermissions();
useForegroundPermissions(options)
Parameter	Type
options
(optional)
PermissionHookOptions<object>

Check or request permissions for the foreground location. This uses both requestForegroundPermissionsAsync and getForegroundPermissionsAsync to interact with the permissions.

Returns:
[null | LocationPermissionResponse, RequestPermissionMethod<LocationPermissionResponse>, GetPermissionMethod<LocationPermissionResponse>]
Example

const [status, requestPermission] = Location.useForegroundPermissions();
Methods
Location.enableNetworkProviderAsync()
Asks the user to turn on high accuracy location mode which enables network provider that uses Google Play services to improve location accuracy and location-based services.

Returns:
Promise<void>
A promise resolving as soon as the user accepts the dialog. Rejects if denied.

Location.geocodeAsync(address)
Parameter	Type	Description
address	string	
A string representing address, eg. "Baker Street London".


Geocode an address string to latitude-longitude location.

On Android, you must request location permissions with requestForegroundPermissionsAsync before geocoding can be used.

Note: Geocoding is resource consuming and has to be used reasonably. Creating too many requests at a time can result in an error, so they have to be managed properly. It's also discouraged to use geocoding while the app is in the background and its results won't be shown to the user immediately.

Returns:
Promise<LocationGeocodedLocation[]>
A promise which fulfills with an array (in most cases its size is 1) of LocationGeocodedLocation objects.

Location.getBackgroundPermissionsAsync()
Checks user's permissions for accessing location while the app is in the background.

Returns:
Promise<PermissionResponse>
A promise that fulfills with an object of type PermissionResponse.

Location.getCurrentPositionAsync(options)
Parameter	Type
options
(optional)
LocationOptions

Requests for one-time delivery of the user's current location. Depending on given accuracy option it may take some time to resolve, especially when you're inside a building.

Note: Calling it causes the location manager to obtain a location fix which may take several seconds. Consider using getLastKnownPositionAsync if you expect to get a quick response and high accuracy is not required.

Returns:
Promise<LocationObject>
A promise which fulfills with an object of type LocationObject.

Location.getForegroundPermissionsAsync()
Checks user's permissions for accessing location while the app is in the foreground.

Returns:
Promise<LocationPermissionResponse>
A promise that fulfills with an object of type LocationPermissionResponse.

Location.getHeadingAsync()
Gets the current heading information from the device. To simplify, it calls watchHeadingAsync and waits for a couple of updates, and then returns the one that is accurate enough.

Returns:
Promise<LocationHeadingObject>
A promise which fulfills with an object of type LocationHeadingObject.

Location.getLastKnownPositionAsync(options)
Parameter	Type
options
(optional)
LocationLastKnownOptions

Gets the last known position of the device or null if it's not available or doesn't match given requirements such as maximum age or required accuracy. It's considered to be faster than getCurrentPositionAsync as it doesn't request for the current location, but keep in mind the returned location may not be up-to-date.

Returns:
Promise<LocationObject | null>
A promise which fulfills with an object of type LocationObject or null if it's not available or doesn't match given requirements such as maximum age or required accuracy.

Location.getProviderStatusAsync()
Check status of location providers.

Returns:
Promise<LocationProviderStatus>
A promise which fulfills with an object of type LocationProviderStatus.

Location.hasServicesEnabledAsync()
Checks whether location services are enabled by the user.

Returns:
Promise<boolean>
A promise which fulfills to true if location services are enabled on the device, or false if not.

Location.hasStartedGeofencingAsync(taskName)
Parameter	Type	Description
taskName	string	
Name of the geofencing task to check.


Returns:
Promise<boolean>
A promise which fulfills with boolean value indicating whether the geofencing task is started or not.

Location.hasStartedLocationUpdatesAsync(taskName)
Parameter	Type	Description
taskName	string	
Name of the location task to check.


Returns:
Promise<boolean>
A promise which fulfills with boolean value indicating whether the location task is started or not.

Location.installWebGeolocationPolyfill()
Polyfills navigator.geolocation for interop with the core React Native and Web API approach to geolocation.

Returns:
void
Location.isBackgroundLocationAvailableAsync()
Returns:
Promise<boolean>
Location.requestBackgroundPermissionsAsync()
Asks the user to grant permissions for location while the app is in the background. On Android 11 or higher: this method will open the system settings page - before that happens you should explain to the user why your application needs background location permission. For example, you can use Modal component from react-native to do that.

Note: Foreground permissions should be granted before asking for the background permissions (your app can't obtain background permission without foreground permission).

Returns:
Promise<PermissionResponse>
A promise that fulfills with an object of type PermissionResponse.

Location.requestForegroundPermissionsAsync()
Asks the user to grant permissions for location while the app is in the foreground.

Returns:
Promise<LocationPermissionResponse>
A promise that fulfills with an object of type LocationPermissionResponse.

Location.reverseGeocodeAsync(location)
Parameter	Type	Description
location	Pick<LocationGeocodedLocation, 'latitude' | 'longitude'>	
An object representing a location.


Reverse geocode a location to postal address.

On Android, you must request location permissions with requestForegroundPermissionsAsync before geocoding can be used.

Note: Geocoding is resource consuming and has to be used reasonably. Creating too many requests at a time can result in an error, so they have to be managed properly. It's also discouraged to use geocoding while the app is in the background and its results won't be shown to the user immediately.

Returns:
Promise<LocationGeocodedAddress[]>
A promise which fulfills with an array (in most cases its size is 1) of LocationGeocodedAddress objects.

Location.startGeofencingAsync(taskName, regions)
Parameter	Type	Description
taskName	string	
Name of the task that will be called when the device enters or exits from specified regions.

regions
(optional)
LocationRegion[]	
Array of region objects to be geofenced.

Default:
[]

Starts geofencing for given regions. When the new event comes, the task with specified name will be called with the region that the device enter to or exit from. If you want to add or remove regions from already running geofencing task, you can just call startGeofencingAsync again with the new array of regions.

Task parameters
Geofencing task will be receiving following data:

eventType - Indicates the reason for calling the task, which can be triggered by entering or exiting the region. See GeofencingEventType.
region - Object containing details about updated region. See LocationRegion for more details.
Returns:
Promise<void>
A promise resolving as soon as the task is registered.

Example

import { GeofencingEventType } from 'expo-location';
import * as TaskManager from 'expo-task-manager';

 TaskManager.defineTask(YOUR_TASK_NAME, ({ data: { eventType, region }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  if (eventType === GeofencingEventType.Enter) {
    console.log("You've entered region:", region);
  } else if (eventType === GeofencingEventType.Exit) {
    console.log("You've left region:", region);
  }
});
Location.startLocationUpdatesAsync(taskName, options)
Parameter	Type	Description
taskName	string	
Name of the task receiving location updates.

options
(optional)
LocationTaskOptions	
An object of options passed to the location manager.


Registers for receiving location updates that can also come when the app is in the background.

Task parameters
Background location task will be receiving following data:

locations - An array of the new locations.
Returns:
Promise<void>
A promise resolving once the task with location updates is registered.

Example

import * as TaskManager from 'expo-task-manager';

TaskManager.defineTask(YOUR_TASK_NAME, ({ data: { locations }, error }) => {
 if (error) {
   // check `error.message` for more details.
   return;
 }
 console.log('Received new locations', locations);
});
Location.stopGeofencingAsync(taskName)
Parameter	Type	Description
taskName	string	
Name of the task to unregister.


Stops geofencing for specified task. It unregisters the background task so the app will not be receiving any updates, especially in the background.

Returns:
Promise<void>
A promise resolving as soon as the task is unregistered.

Location.stopLocationUpdatesAsync(taskName)
Parameter	Type	Description
taskName	string	
Name of the background location task to stop.


Stops location updates for specified task.

Returns:
Promise<void>
A promise resolving as soon as the task is unregistered.

Location.watchHeadingAsync(callback, errorHandler)
Parameter	Type	Description
callback	LocationHeadingCallback	
This function is called on each compass update. It receives an object of type LocationHeadingObject as the first argument.

errorHandler
(optional)
LocationErrorCallback	
This function is called when an error occurs. It receives a string with the error message as the first argument.


Subscribe to compass updates from the device.

Returns:
Promise<LocationSubscription>
A promise which fulfills with a LocationSubscription object.

Location.watchPositionAsync(options, callback, errorHandler)
Parameter	Type	Description
options	LocationOptions	
-
callback	LocationCallback	
This function is called on each location update. It receives an object of type LocationObject as the first argument.

errorHandler
(optional)
LocationErrorCallback	
This function is called when an error occurs. It receives a string with the error message as the first argument.


Subscribe to location updates from the device. Updates will only occur while the application is in the foreground. To get location updates while in background you'll need to use startLocationUpdatesAsync.

Returns:
Promise<LocationSubscription>
A promise which fulfills with a LocationSubscription object.

Types
LocationCallback(location)
Represents watchPositionAsync callback.

Parameter	Type
location	LocationObject
Returns:
any

LocationErrorCallback(reason)
Error callback for location methods.

Parameter	Type
reason	string
Returns:
void

LocationGeocodedAddress
Type representing a result of reverseGeocodeAsync.

Property	Type	Description
city	string | null	
City name of the address.

country	string | null	
Localized country name of the address.

district	string | null	
Additional city-level information like district name.

formattedAddress	string | null	
Only for: 

Composed string of the address components, for example, "111 8th Avenue, New York, NY".

isoCountryCode	string | null	
Localized (ISO) country code of the address, if available.

name	string | null	
The name of the placemark, for example, "Tower Bridge".

postalCode	string | null	
Postal code of the address.

region	string | null	
The state or province associated with the address.

street	string | null	
Street name of the address.

streetNumber	string | null	
Street number of the address.

subregion	string | null	
Additional information about administrative area.

timezone	string | null	
Only for: 

The timezone identifier associated with the address.

LocationGeocodedLocation
Type representing a result of geocodeAsync.

Property	Type	Description
accuracy
(optional)
number	
The radius of uncertainty for the location, measured in meters.

altitude
(optional)
number	
The altitude in meters above the WGS 84 reference ellipsoid.

latitude	number	
The latitude in degrees.

longitude	number	
The longitude in degrees.

LocationHeadingCallback(location)
Represents watchHeadingAsync callback.

Parameter	Type
location	LocationHeadingObject
Returns:
any

LocationHeadingObject
Type of the object containing heading details and provided by watchHeadingAsync callback.

Property	Type	Description
accuracy	number	
Level of calibration of compass:

3: high accuracy
2: medium accuracy
1: low accuracy
0: none
Reference for iOS:

3: < 20 degrees uncertainty
2: < 35 degrees
1: < 50 degrees
0: > 50 degrees
magHeading	number	
Measure of magnetic north in degrees.

trueHeading	number	
Measure of true north in degrees (needs location permissions, will return -1 if not given).

LocationLastKnownOptions
Type representing options object that can be passed to getLastKnownPositionAsync.

Property	Type	Description
maxAge
(optional)
number	
A number of milliseconds after which the last known location starts to be invalid and thus null is returned.

requiredAccuracy
(optional)
number	
The maximum radius of uncertainty for the location, measured in meters. If the last known location's accuracy radius is bigger (less accurate) then null is returned.

LocationObject
Type representing the location object.

Property	Type	Description
coords	LocationObjectCoords	
The coordinates of the position.

mocked
(optional)
boolean	
Only for: 

Whether the location coordinates is mocked or not.

timestamp	number	
The time at which this position information was obtained, in milliseconds since epoch.

LocationObjectCoords
Type representing the location GPS related data.

Property	Type	Description
accuracy	number | null	
The radius of uncertainty for the location, measured in meters. Can be null on Web if it's not available.

altitude	number | null	
The altitude in meters above the WGS 84 reference ellipsoid. Can be null on Web if it's not available.

altitudeAccuracy	number | null	
The accuracy of the altitude value, in meters. Can be null on Web if it's not available.

heading	number | null	
Horizontal direction of travel of this device, measured in degrees starting at due north and continuing clockwise around the compass. Thus, north is 0 degrees, east is 90 degrees, south is 180 degrees, and so on. Can be null on Web if it's not available.

latitude	number	
The latitude in degrees.

longitude	number	
The longitude in degrees.

speed	number | null	
The instantaneous speed of the device in meters per second. Can be null on Web if it's not available.

LocationOptions
Type representing options argument in getCurrentPositionAsync.

Property	Type	Description
accuracy
(optional)
Accuracy	
Location manager accuracy. Pass one of Accuracy enum values. For low-accuracies the implementation can avoid geolocation providers that consume a significant amount of power (such as GPS).

Default:
LocationAccuracy.Balanced
distanceInterval
(optional)
number	
Receive updates only when the location has changed by at least this distance in meters. Default value may depend on accuracy option.

mayShowUserSettingsDialog
(optional)
boolean	
Only for: 

Specifies whether to ask the user to turn on improved accuracy location mode which uses Wi-Fi, cell networks and GPS sensor.

Default:
true
timeInterval
(optional)
number	
Only for: 

Minimum time to wait between each update in milliseconds. Default value may depend on accuracy option.

LocationPermissionResponse
LocationPermissionResponse extends PermissionResponse type exported by expo-modules-core and contains additional platform-specific fields.

Type: PermissionResponse extended by:

Property	Type	Description
android
(optional)
PermissionDetailsLocationAndroid	
-
ios
(optional)
Permi

Expo Fingerprint



A library to generate a fingerprint from a React Native project.

Bundled version:
~0.15.0
@expo/fingerprint provides an API to generate a fingerprint (hash) of your project for use in determining compatibility between the native layer and JavaScript layer of your app. The hash calculation is configurable, but is by default derived from hashing app dependencies, custom native code, native project files, and configuration.

Installation
@expo/fingerprint is included with expo and expo-updates by default.

If you wish to use @expo/fingerprint as a standalone package, you can install it by running the command:

Terminal

Copy

npx expo install @expo/fingerprint
CLI Usage
Terminal

Copy

npx @expo/fingerprint --help
Configuration
@expo/fingerprint provides defaults that should work for most projects, but also provides a few ways to configure the fingerprinting process to better fit your app structure and workflow.

.fingerprintignore
Placed in your project root, .fingerprintignore is a .gitignore-like ignore mechanism used to exclude files from hash calculation. All pattern paths are relative to the project root. It behaves similarly but instead uses minimatch for pattern matching which has some limitations (see documentation for ignorePaths under Options).

Here is an example .fingerprintignore configuration:

.fingerprintignore

Copy


# Ignore the entire android directory
android/**/*

# Ignore the entire ios directory but still keep ios/Podfile and ios/Podfile.lock
ios/**/*
!ios/Podfile
!ios/Podfile.lock

# Ignore specific package in node_modules
node_modules/some-package/**/*

# Same as above but having broader scope because packages may be nested
**/node_modules/some-package/**/*
fingerprint.config.js
Placed in your project root, fingerprint.config.js allows you to specify custom hash calculation configuration beyond what is configurable in the .fingerprintignore. For supported configurations, see Config and SourceSkips.

Below is an example fingerprint.config.js configuration, assuming you have @expo/fingerprint installed as a direct dependency:

fingerprint.config.js

Copy


/** @type {import('@expo/fingerprint').Config} */
const config = {
  sourceSkips: [
    'ExpoConfigRuntimeVersionIfString',
    'ExpoConfigVersions',
    'PackageJsonAndroidAndIosScriptsIfNotContainRun',
  ],
};
module.exports = config;
If you are using @expo/fingerprint through expo (where @expo/fingerprint is installed as a transitive dependency), you can import fingerprint from expo/fingerprint:

/** @type {import('expo/fingerprint').Config} */
Advanced: Customize sources before fingerprint hashing



Limitations
Limited support for @expo/config-plugins raw functions













API
import * as Fingerprint from '@expo/fingerprint';
Constants
Fingerprint.DEFAULT_IGNORE_PATHS
Type: string[]

Fingerprint.DEFAULT_SOURCE_SKIPS
Type: PackageJsonAndroidAndIosScriptsIfNotContainRun

Methods
Fingerprint.createFingerprintAsync(projectRoot, options)
Parameter	Type
projectRoot	string
options
(optional)
Options

Create a fingerprint for a project.

Returns:
Promise<Fingerprint>
Example

const fingerprint = await createFingerprintAsync('/app');
console.log(fingerprint);
Fingerprint.createProjectHashAsync(projectRoot, options)
Parameter	Type
projectRoot	string
options
(optional)
Options

Create a native hash value for a project.

Returns:
Promise<string>
Example

const hash = await createProjectHashAsync('/app');
console.log(hash);
Fingerprint.diffFingerprintChangesAsync(fingerprint, projectRoot, options)
Parameter	Type
fingerprint	Fingerprint
projectRoot	string
options
(optional)
Options

Diff the fingerprint with the fingerprint of the provided project.

Returns:
Promise<FingerprintDiffItem[]>
Example

// Create a fingerprint for the project
const fingerprint = await createFingerprintAsync('/app');

// Make some changes to the project

// Calculate the diff
const diff = await diffFingerprintChangesAsync(fingerprint, '/app');
console.log(diff);
Fingerprint.diffFingerprints(fingerprint1, fingerprint2)
Parameter	Type
fingerprint1	Fingerprint
fingerprint2	Fingerprint

Diff two fingerprints. The implementation assumes that the sources are sorted.

Returns:
FingerprintDiffItem[]
Example

// Create a fingerprint for the project
const fingerprint = await createFingerprintAsync('/app');

// Make some changes to the project

// Create a fingerprint again
const fingerprint2 = await createFingerprintAsync('/app');
const diff = await diffFingerprints(fingerprint, fingerprint2);
console.log(diff);
Interfaces
DebugInfoContents
Property	Type	Description
hash	string	
-
isTransformed
(optional)
boolean	
Indicates whether the source is transformed by fileHookTransform.

DebugInfoDir
Property	Type	Description
children	(undefined | DebugInfoFile | DebugInfoDir)[]	
-
hash	string	
-
path	string	
-
DebugInfoFile
Property	Type	Description
hash	string	
-
isTransformed
(optional)
boolean	
Indicates whether the source is transformed by fileHookTransform.

path	string	
-
Fingerprint
Property	Type	Description
hash	string	
The final hash value of the whole project fingerprint.

sources	FingerprintSource[]	
Sources and their hash values from which the project fingerprint was generated.

HashResultContents
Property	Type	Description
debugInfo
(optional)
DebugInfoContents	
-
hex	string	
-
id	string	
-
type	'contents'	
-
HashResultDir
Property	Type	Description
debugInfo
(optional)
DebugInfoDir	
-
hex	string	
-
id	string	
-
type	'dir'	
-
HashResultFile
Property	Type	Description
debugInfo
(optional)
DebugInfoFile	
-
hex	string	
-
id	string	
-
type	'file'	
-
HashSourceContents
Property	Type	Description
contents	string | Buffer	
-
id	string	
-
reasons	string[]	
Reasons of this source coming from.

type	'contents'	
-
HashSourceDir
Property	Type	Description
filePath	string	
-
reasons	string[]	
Reasons of this source coming from.

type	'dir'	
-
HashSourceFile
Property	Type	Description
filePath	string	
-
reasons	string[]	
Reasons of this source coming from.

type	'file'	
-
Options
Property	Type	Description
concurrentIoLimit
(optional)
number	
I/O concurrency limit.

Default:
The number of CPU cores.
debug
(optional)
boolean	
Whether to include verbose debug info in source output. Useful for debugging.

dirExcludes
(optional)
string[]	
Deprecated Use ignorePaths instead.

Exclude specified directories from hashing. The supported pattern is the same as glob(). Default is ['android/build', 'android/app/build', 'android/app/.cxx', 'ios/Pods'].

enableReactImportsPatcher
(optional)
boolean	
Enable ReactImportsPatcher to transform imports from React of the form #import "RCTBridge.h" to #import <React/RCTBridge.h>. This is useful when you want to have a stable fingerprint for Expo projects, since expo-modules-autolinking will change the import style on iOS.

Default:
true for Expo SDK 51 and lower.
extraSources
(optional)
HashSource[]	
Additional sources for hashing.

fileHookTransform
(optional)
FileHookTransformFunction	
A custom hook function to transform file content sources before hashing.

hashAlgorithm
(optional)
string	
The algorithm to use for crypto.createHash().

Default:
'sha1'
ignorePaths
(optional)
string[]	
Ignore files and directories from hashing. The supported pattern is the same as glob().

The pattern matching is slightly different from gitignore. Partial matching is unsupported. For example, build does not match android/build; instead, use '**' + '/build'.

See: minimatch implementations for further reference.

Fingerprint comes with implicit default ignorePaths defined in Options.DEFAULT_IGNORE_PATHS. If you want to override the default ignorePaths, use ! prefix in ignorePaths.

platforms
(optional)
Platform[]	
Limit native files to those for specified platforms.

Default:
['android', 'ios']
silent
(optional)
boolean	
Whether running the functions should mute all console output. This is useful when fingerprinting is being done as part of a CLI that outputs a fingerprint and outputting anything else pollutes the results.

sourceSkips
(optional)
SourceSkips	
Skips some sources from fingerprint. Value is the result of bitwise-OR'ing desired values of SourceSkips.

Default:
DEFAULT_SOURCE_SKIPS
useRNCoreAutolinkingFromExpo
(optional)
boolean	
Use the react-native core autolinking sources from expo-modules-autolinking rather than @react-native-community/cli.

Default:
true for Expo SDK 52 and higher.
Types
Config
Supported options for use in fingerprint.config.js

Type: Pick<Options, 'concurrentIoLimit' | 'hashAlgorithm' | 'ignorePaths' | 'extraSources' | 'enableReactImportsPatcher' | 'useRNCoreAutolinkingFromExpo' | 'debug' | 'fileHookTransform'> extended by:

Property	Type	Description
sourceSkips
(optional)
SourceSkips | SourceSkipsKeys[]	
-
DebugInfo
Literal Type: union

Acceptable values are: DebugInfoFile | DebugInfoDir | DebugInfoContents

FileHookTransformFunction(source, chunk, isEndOfFile, encoding)
Hook function to transform file content sources before hashing.

Parameter	Type
source	FileHookTransformSource
chunk	Buffer | string | null
isEndOfFile	boolean
encoding	BufferEncoding
Returns:
Buffer | string | null

FileHookTransformSource
The source parameter for FileHookTransformFunction.

Type: object shaped as below:

Property	Type	Description
filePath	string	
-
type	'file'	
-
Or object shaped as below:

Property	Type	Description
id	string	
-
type	'contents'	
-
FingerprintDiffItem
Type: object shaped as below:

Property	Type	Description
addedSource	FingerprintSource	
The added source.

op	'added'	
The operation type of the diff item.

Or object shaped as below:

Property	Type	Description
op	'removed'	
The operation type of the diff item.

removedSource	FingerprintSource	
The removed source.

Or object shaped as below:

Property	Type	Description
afterSource	FingerprintSource	
The source after.

beforeSource	FingerprintSource	
The source before.

op	'changed'	
The operation type of the diff item.

FingerprintSource
Type: HashSource extended by:

Property	Type	Description
debugInfo
(optional)
DebugInfo	
Debug info from the hashing process. Differs based on source type. Designed to be consumed by humans as opposed to programmatically.

hash	string | null	
Hash value of the source. If the source is excluded the value will be null.

HashResult
Literal Type: union

Acceptable values are: HashResultFile | HashResultDir | HashResultContents

HashSource
Literal Type: union

Acceptable values are: HashSourceFile | HashSourceDir | HashSourceContents

Platform
Literal Type: string

Acceptable values are: 'android' | 'ios'

ProjectWorkflow
Literal Type: string

Acceptable values are: 'generic' | 'managed' | 'unknown'

Enums
SourceSkips
Bitmask of values that can be used to skip certain parts of the sourcers when generating a fingerprint.

None
SourceSkips.None ＝ 0
Skip nothing

ExpoConfigVersions
SourceSkips.ExpoConfigVersions ＝ 1
Versions in app.json, including Android versionCode and iOS buildNumber

ExpoConfigRuntimeVersionIfString
SourceSkips.ExpoConfigRuntimeVersionIfString ＝ 2
runtimeVersion in app.json if it is a string

ExpoConfigNames
SourceSkips.ExpoConfigNames ＝ 4
App names in app.json, including shortName and description

ExpoConfigAndroidPackage
SourceSkips.ExpoConfigAndroidPackage ＝ 8
Android package name in app.json

ExpoConfigIosBundleIdentifier
SourceSkips.ExpoConfigIosBundleIdentifier ＝ 16
iOS bundle identifier in app.json

ExpoConfigSchemes
SourceSkips.ExpoConfigSchemes ＝ 32
Schemes in app.json

ExpoConfigEASProject
SourceSkips.ExpoConfigEASProject ＝ 64
EAS project information in app.json

ExpoConfigAssets
SourceSkips.ExpoConfigAssets ＝ 128
Assets in app.json, including icons and splash assets

ExpoConfigAll
SourceSkips.ExpoConfigAll ＝ 256
Skip the whole ExpoConfig. Prefer the other ExpoConfig source skips when possible and use this flag with caution. This will potentially ignore some native changes that should be part of most fingerprints. E.g., adding a new config plugin, changing the app icon, or changing the app name.

PackageJsonAndroidAndIosScriptsIfNotContainRun
SourceSkips.PackageJsonAndroidAndIosScriptsIfNotContainRun ＝ 512
package.json scripts if android and ios items do not contain "run". Because prebuild will change the scripts in package.json, this is useful to generate a consistent fingerprint before and after prebuild.

PackageJsonScriptsAll
SourceSkips.PackageJsonScriptsAll ＝ 1024
Skip the whole scripts section in the project's package.json.

GitIgnore
SourceSkips.GitIgnore ＝ 2048
Skip .gitignore files.

ExpoConfigExtraSection
SourceSkips.ExpoConfigExtraSection ＝ 4096
The extra section in app.json


Expo DocumentPicker



A library that provides access to the system's UI for selecting documents from the available providers on the user's device.

Bundled version:
~14.0.6
expo-document-picker provides access to the system's UI for selecting documents from the available providers on the user's device.

Installation
Terminal

Copy

npx expo install expo-document-picker
If you are installing this in an existing React Native app, make sure to install expo in your project.

Configuration in app config
You can configure expo-document-picker using its built-in config plugin if you use config plugins in your project (EAS Build or npx expo run:[android|ios]). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect. If your app does not use EAS Build, then you'll need to manually configure the package.

Example app.json with config plugin
If you want to enable iCloud storage features, set the expo.ios.usesIcloudStorage key to true in the app config file as specified configuration properties.

Running EAS Build locally will use iOS capabilities signing to enable the required capabilities before building.

app.json

Copy


{
  "expo": {
    "plugins": [
      [
        "expo-document-picker",
        {
          "iCloudContainerEnvironment": "Production"
        }
      ]
    ]
  }
}
Configurable properties
Name	Default	Description
iCloudContainerEnvironment	undefined	
Only for: 

Sets the iOS com.apple.developer.icloud-container-environment entitlement used for AdHoc iOS builds. Possible values: Development, Production. Learn more.

kvStoreIdentifier	undefined	
Only for: 

Overrides the default iOS com.apple.developer.ubiquity-kvstore-identifier entitlement, which uses your Apple Team ID and bundle identifier. This may be needed if your app was transferred to another Apple Team after enabling iCloud storage.

Are you using this library in an existing React Native app?



Using with expo-file-system
When using expo-document-picker with expo-file-system, it's not always possible for the file system to read the file immediately after the expo-document-picker picks it.

To allow the expo-file-system to read the file immediately after it is picked, you'll need to ensure that the copyToCacheDirectory option is set to true.

API
import * as DocumentPicker from 'expo-document-picker';
Component
getDocumentAsync
Type: React.Element<DocumentPickerOptions>

Display the system UI for choosing a document. By default, the chosen file is copied to the app's internal cache directory.

Notes for Web: The system UI can only be shown after user activation (e.g. a Button press). Therefore, calling getDocumentAsync in componentDidMount, for example, will not work as intended. The cancel event will not be returned in the browser due to platform restrictions and inconsistencies across browsers.

Types
DocumentPickerAsset
Property	Type	Description
base64
(optional)
string	
Only for: 

Base64 string of the file.

file
(optional)
File	
Only for: 

File object for the parity with web File API.

lastModified	number	
Timestamp of last document modification. Web API specs The lastModified provides the last modified date of the file as the number of milliseconds since the Unix epoch (January 1, 1970 at midnight). Files without a known last modified date return the current date.

mimeType
(optional)
string	
Document MIME type.

name	string	
Document original name.

size
(optional)
number	
Document size in bytes.

uri	string	
An URI to the local document file.

DocumentPickerCanceledResult
Type representing canceled pick result.

Property	Type	Description
assets	null	
Always null when the request was canceled.

canceled	true	
Always true when the request was canceled.

output
(optional)
null	
Only for: 

Always null when the request was canceled.

DocumentPickerOptions
Property	Type	Description
base64
(optional)
boolean	
Only for: 

If true, asset url is base64 from the file If false, asset url is the file url parameter

Default:
true
copyToCacheDirectory
(optional)
boolean	
Only for: 

If true, the picked file is copied to FileSystem.CacheDirectory, which allows other Expo APIs to read the file immediately. This may impact performance for large files, so you should consider setting this to false if you expect users to pick particularly large files and your app does not need immediate read access.

Default:
true
multiple
(optional)
boolean	
Allows multiple files to be selected from the system UI.

Default:
false
type
(optional)
string | string[]	
The MIME type(s) of the documents that are available to be picked. It also supports wildcards like 'image/*' to choose any image. To allow any type of document you can use '*/*'.

Default:
'*/*'
DocumentPickerResult
Literal Type: union

Type representing successful and canceled document pick result.

Acceptable values are: DocumentPickerSuccessResult | DocumentPickerCanceledResult

DocumentPickerSuccessResult
Type representing successful pick result.

Property	Type	Description
assets	DocumentPickerAsset[]	
An array of picked assets.

canceled	false	
If asset data have been returned this should always be false.

output
(optional)
FileList	
Only for: 

FileList object for the parity with web File API.