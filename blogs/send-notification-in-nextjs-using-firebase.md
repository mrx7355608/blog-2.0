---
title: 'Sending Notifications in Nextjs application using Firebase Cloud Messaging'
date: '2-16-2025' # follows mm-dd-yyyy format
tags: ['Nextjs', 'Firebase', 'App router', 'Notifications', 'FCM']
summary: "If you have ever tried to add notifications feature to your nextjs or any other application, you must have came across Firebase Cloud Messaging(FCM) and when you try to follow documentation, you probably get frustrated because how messy and confusing it is. I have also faced this so that's why I am writing this blog to help you and future me. So let's get started!"
---

# Introduction

Firebase Cloud Messaging is a notification service that allows you to send and receive notifications in your applications.
However ther are two parts to it

**Client side:** In client side implementation, you receive notifications using firebase sdk and fcm tokens

**Server side:** In server side implementation, the nextjs server sends notification to it's frontend using firebase-admin sdk

> Remeber, I am using Nextjs 15 and App router

# Create a Firebase Project

First open up your firebase [console](https://console.firebase.google.com/u/0/) and create a new project

On the **project overview** screen of your project, click on **Add app** button under your project name and select **Web** from
the options to create a web application in your firebase project.
![Firbase App Setup](/blogs-screenshots/create_firebase_app.png)

Then give your app a name and click **Register App** button. Save the app credentials in a `.env` file

![](/blogs-screenshots/firebase_app_setup.png)

```ini
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
#...and so on
```

# Server Side Implementation

## Install Dependencies

Open up your terminal and install `firebase-admin` sdk as follows:

```bash
npm i firebase-admin
```

## Create Firebase Admin App

We will start by creating a firebase-admin app. Create a `firebase-server.ts` file in **lib** folder with the following code.

```typescript
// lib/firebase-server.ts

import admin from 'firebase-admin';

export function createFirebaseAdminApp() {
  let app = admin.apps[0];

  /* If not existing app */
  if (!app) {
    /* Create a new one */
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }

  return app;
}
```

The above code returns a firebase-admin app. If an app already exists, it returns the existing app otherwise creates a new
app and return it

## Send Notifications

Create a `notification-service.ts` file in **lib** folder with the following code.

```typescript
// lib/notification-service.ts

import { createFirebaseAdminApp } from './firebase-server';
import { getMessaging } from 'firebase-admin/messaging';

export async function sendNotification(
  tokens: string[],
  title: string,
  body: string,
) {
  const payload = {
    tokens,
    notification: {
      title,
      body,
    },
  };

  const app = createFirebaseAdminApp();
  const response = await getMessaging(app).sendEachForMulticast(payload);
  console.log(response);
}
```

The above function takes 3 arguments:

1. **Tokens:** A list of FCM device registration tokens that are retrieved by frontend (discussed later)
2. **Title:** The title of the notification e.g "New Message"
3. **Body:** The text written in the notification e.g "John Doe: Hi, how are you?"

A payload object is created from function arguments. Then a firebase admin app is created and a notification is sent
to multiple devices using `sendEachForMulticast(payload)` function.

A user might login on one or more devices, to ensure that notifications are sent to all the devices that user is
currently active on, `sendEachForMulticast()` method is used. If you want to send notification to only one device you can
use `send()` method and instead of an array of tokens, use a single token in payload.

**Important!** The `notification` field in payload object should be exactly the same otherwise, you may face troubles sending
notifications. We will discuss about sending custom notifications later in this blog

That's pretty much it for the server side. Now lets move on to client side

# Client Side Implementation

When it comes to client side, we have a few more steps to do as compared to server side implementation because it involves:

1. Asking user permission for sending notifications
2. Getting FCM token from firebase and storing it in the database
3. Listening for notifications and displaying them

Before proceeding to writing code we must first genrate VAPID keys which will be used to fetch device registration tokens
from firebase later on.

## Generate VAPID Keys

Go to your project settings. Then go to **Cloud Messaging** tab and scroll to bottom. There you will see a **Web push
certificates** section. Click on the **Generate new pair** button and it will create a key pair for your app.

Copy the key and save it inside your `.env` file with `NEXT_PUBLIC_FIREBASE_VAPID_KEYS` name

```
NEXT_PUBLIC_FIREBASE_VAPID_KEYS="your_key"
```

![](/blogs-screenshots/firebase_vapid_key.png)

Now your `.env` file will look something like this:

```ini
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_FIREBASE_VAPID_KEYS="..."
```

# Installing dependencies and Initializing firebase

Open up your terminal and install firebase client sdk.

```bash
# With npm
npm i firebase

# With yarn
yarn add firebase

# With bun
bun add firebase
```

After installing dependencies, create a `firebase.ts` file inside your **lib** folder and add the following code

```typescript
// lib/firebase.ts

import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

export function createFCMApp() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const firebase = initializeApp(firebaseConfig);
  const messaging = getMessaging(firebase);
  return messaging;
}
```

The above code exports a function `createFCMApp` that creates a firebase app and an FCM app, referenced as `messaging`. This
function will be executed in a client component ensuring that firebase app is created in a browser environment and saves
us from **window is undefined** error.

## Asking User for Notifications Permission

Create a custom hook `useNotificationPermission()` in **hooks** folder with the following code

```typescript
// hooks/useNotificationPermission.ts

import { useEffect, useState } from 'react';

export default function useNotificationsPermission() {
  const [permission, setPermission] =
    useState<NotificationPermission>('denied');

  useEffect(() => {
    Notification.requestPermission().then((perm) => {
      setPermission(perm);
    });
  }, []);

  return { permission };
}
```

This hook prompts user for notification permission and returns it. The default permission state is denied, just to be on
the safe side

## Fetching FCM Token from Firebase

To fetch FCM token (device registration token) from firebase, create a custom hook `useFcmToken()` with the following code

```typescript
// hooks/useFcmToken.ts

import { createFCMApp } from '@/lib/firebase';
import { getToken } from 'firebase/messaging';
import { useEffect, useState } from 'react';
import useNotificationsPermission from './useNotificationPermission';

export default function useFcmToken() {
  const { permission } = useNotificationsPermission();
  const [fcmToken, setFcmToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (permission === 'granted') {
      getFcmToken();
    }
  }, [permission]);

  async function getFcmToken() {
    const messaging = createFCMApp();

    /* Get previously stored token from local storage */
    let token = localStorage.getItem('fcm-token');
    if (token) {
      setFcmToken(token);
      return;
    }

    /* Otherwise, get token from firebase */
    console.log('--- Fetching token from firebase ---');
    token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEYS,
    });
    if (!token) {
      console.error('Unable to fetch FCM token');
      return;
    }

    /* Save token in mongodb */
    console.log('--- Saving Token in Database ---');
    await saveTokenInDatabase(token);

    /* Save token in local storage */
    localStorage.setItem('fcm-token', token);
    setFcmToken(token);
  }

  return { fcmToken };
}
```

This hook utilizes the previous `useNotificationPermission()` hook and if the permission is **granted** the token is fetched.
To fetch token, first we check if the token already exists in our localStorage. If it's there it means that user has already
fetched the token from firebase and does not need to re-fetch the token.

If the token is not found in localStorage, a request will be made to firebase using `getToken(messaging, { vapidKeys: "..." })`
method. Then the token is saved in database and in localStorage.

## Receiving Notifications

Create another custom hook `useFcm()` file with following code

```typescript
import { useEffect } from 'react';
import useFcmToken from './useFcmToken';
import { createFCMApp } from '@/lib/firebase';
import { onMessage } from 'firebase/messaging';
import { useToast } from './useToast';

export default function useFcm() {
  const { fcmToken } = useFcmToken();
  const { addToast } = useToast();

  useEffect(() => {
    if (!fcmToken) {
      return;
    }

    const messaging = createFCMApp();
    onMessage(messaging, ({ notification }) => {
      if (notification) {
        const title = notification.title || 'Unknown notification';
        const body = notification.body || 'Unknown message';
        addToast('info', title, body);
      }
    });
  }, [fcmToken]);

  return null;
}
```

This hook registers an event listener `onMessage` that runs whenever a notification is received and the application is in
**FOREGROUND**. You can display notification in any way you like here I am displaying a toast
Our whole setup is complete, now we are missing only one piece of the puzzle and that's **Firebase service worker**

Firebase Cloud Messaging requires a service worker file that will run in background and handle notifications.

> According to firebase, the service worker file is only used for showing notifications when app is in background,
> however that's not the case. You will not receive any notification if you have not setup the service worker, it doesn't
> matter if your app is in background or foreground

Create a `firebase-messaging-sw.js` file in **public** directory of your nextjs app. If you have created this file in
**root directory** of your project, **it will not work**.

**Note:** We cannot use `.env` here. For now just hardcode your firebase credentials in this service worker. We will hide
them later on using route handlers in our nextjs app.

```javascript
// public/firebase-messaging-sw.js

importScripts(
  'https://www.gstatic.com/firebasejs/11.3.1/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/11.3.1/firebase-messaging-compat.js',
);

// Initialize the Firebase app in the service worker
const config = {
  apiKey: '...',
  authDomain: '...',
  projectId: '...',
  storageBucket: '...',
  messagingSenderId: '...',
  appId: '...',
};
const app = firebase.initializeApp(config);

const messaging = firebase.messaging(app); // WARNING: DO NOT REMOVE THIS LINE!!!!!!!

messaging.onBackgroundMessage((payload) => {
  // NOTE: This event handler AUTOMATICALLY displays notifications
  // So we are just logging the payload on screen
  console.log('Received background message: ', payload);
});
```

The above code initializes a firebase app. Then it creates a messaging instance and adds and event listener `onBackgroundMessage`
to receive and handle background notifications

> The line marked with a WARNING comment is very important because without this line we will not receive any notification
> either foreground or background.

# Additional Stuff

We have a basic notification system running. However there are some more adjustments we can do like or need to do like:

1. Hiding firebase credentials in service worker
2. Handling notification clicks
3. Showing image in our notifications

To learn about them you can read my blog [here](/additional-firebase-notifications-setup-in-nextjs-app)
