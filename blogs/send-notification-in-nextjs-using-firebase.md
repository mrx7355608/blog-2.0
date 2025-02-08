---
title: 'Send Notifications in Nextjs application using Firebase Cloud Messaging'
date: '2-9-2025' # follows mm-dd-yyyy format
tags:
  [
    'Nextjs',
    'Firebase',
    'App router',
    'Notifications',
    'FCM',
    'Firebase Cloud Messaging',
  ]
summary: "If you have ever tried to add notifications feature to your nextjs or any other application, you must have came across Firebase Cloud Messaging(FCM) and when you try to follow documentation, you probably get frustrated because how messy and confusing it is. I have also faced this so that's why I am writing this blog to help you and future me. So let's get started!"
---

# Introduction

Firebase Cloud Messaging is a notification service that allows you to send and receive notifications in your applications. However ther are two parts to it

**Client side:** In client side implementation, you ask notification permissions from user and fetch the fcm token from firebase and send it to your server so that it can be saved in the database. On frontend / client you only receive and display notifications.

**Server side:** In server side implementation, the server sends notification to your frontend using the fcm tokens, on certain events like someone sent a friend request, or a new message is received, etc.

I will be explaining the client side implementation in this part using one of my own chatapplication project. The server side part will be explained in the next blog

> Remeber, I am using Nextjs 15 and App router

# Setup FCM

First open up your firebase [console](https://console.firebase.google.com/u/0/) and click on **Get started with a Firebase project** to create a new project.
![](/blogs-screenshots/firebase_project_setup.png)

Give your project a name and enabling / disabling google analytics is upto you, however I have kept it disabled

Now you will be on the **project overview** screen of your project. From their click on **Add app** button under your project name and select **Web** from the options to create a web application in your firebase project.
![Firbase App Setup](/blogs-screenshots/create_firebase_app.png)

Then give your app a name and click **Register App** button. Save the app credentials in a `.env` file

![](/blogs-screenshots/firebase_app_setup.png)

```
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
#...and so on
```

# Generate VAPID keys

Go to your project settings from the project overview tab. Go to **Cloud Messaging** tab and scroll to bottom. There you will see a **Web push certificates** section. Click on the **Generate new pair** button and it will create a key pair for your app.

Copy the key and save it inside your `.env` file with `NEXT_PUBLIC_FIREBASE_VAPID_KEYS` name

```
NEXT_PUBLIC_FIREBASE_VAPID_KEYS="your_key"
```

![](/blogs-screenshots/firebase_vapid_key.png)

Now your `.env` file will look something like this:

```
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
NEXT_PUBLIC_FIREBASE_VAPID_KEYS=""
```

After you have done all the above steps it's time to open vscode (i use neovim btw 💪) and write some code

# Installing dependencies and Initializing firebase

Open up your terminal and install firebase client sdk (remember we are setting up our frontend first, then we will go to server side implementation)

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

The above code exports a function `createFCMApp` that creates a firebase app and an FCM app, referenced as `messaging` in the above code. This function will be executed in a client component ensuring that firebase app is created in a browser environment and saves us from **window is undefined** error.

In firebase documentation, they have a slightly different setup than mine. When people import the firebase app from `lib/firebase.ts` file as per their setup, they encounter errors regarding `window` object being undefined because nextjs executes the file in server environment where window object is not available obviously. So to avoid all that mess I have exported a function from `lib/firebase.ts` file which will be called in a client component.

# Registering a Service Worker

Firebase Cloud Messaging requires a service worker file that will run in background and handle notifications.

> According to firebase, the service worker file is only used for showing notifications when app is in background,
> however that's not the case. You will not receive any notification if you have not setup the service worker, it doesn't
> matter if your app is in background or foreground

Create a `firebase-messaging-sw.js` file in **public** directory of your nextjs app. If you have created this file in **root directory** of your project, **it will not work**.
Unfortunately, you have to enter your credentials here, you cannot use `.env` here. There are workarounds, you can google them
I haven't done that yet. However, I have found this dev.to [article](https://dev.to/yutakusuno/react-passing-environment-variables-to-service-workers-5egj)

```javascript
// Give the service worker access to Firebase Messaging.
// NOTE: You can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js',
);

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: 'A..',
  authDomain: 'd...',
  projectId: 'c..',
  storageBucket: 'c...',
  messagingSenderId: '4..',
  appId: 'F..',
});

// WARNING: Do not remove the line below otherwise you won't receive notifications
// Retrieve an instance of Firebase Messaging so that it can handle both, foreground
// and background messages
const messaging = firebase.messaging();
```

We are done setting up FCM. Now we only need to ask user for notification permissions and then fetch the fcm token from firebase

# Asking for notification permission

First we must ask for user permission before pushing notifications. To do that I will create a hook called `useFcmToken()` which will be responsible for asking user permission and fetching fcm token from firebase

Create a file called `useFcmToken.ts` in hooks folder and paste the below content

```typescript
'use client';

import { createFCMApp } from '@/lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { useEffect } from 'react';
import { useToast } from './useToast';

export default function useFcmToken() {
  useEffect(() => {
    console.log('Requesting permission...');

    Notification.requestPermission().then(async (permission) => {
      if (permission === 'denied') {
        console.warn('Notification permission denied!');
        return;
      }

      console.log('Notification permission granted.');

      /* Create FCM App to register a listener */
      const messaging = createFCMApp();

      /* Check if token is in localstorage */
      let token = localStorage.getItem('fcm-token');

      /* If not, then fetch it from firebase */
      if (!token) {
        token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEYS,
        });

        /* Save token in local storage */
        localStorage.setItem('fcm-token', token);
      }

      console.log({ token });

      /* After fetching token, register a listener for notifications */
      onMessage(messaging, (payload) => {
        console.log(payload.notification);
      });
    });
  }, []);

  return null;
}
```

This hook gets the user permission and then creates an fcm app using `createFCMApp()` function that we exported previously from `lib/firebase.ts`. After that, it fetches token from local storage and if it does not find it in local storage, then it makes a request to firebase for the token. Then, it registers an event listener `onMessage` to listen for notifications and log them on console.

You can show notifications using a toast component while app is in foreground.

To use this hook we need to create a client component in which this hook will be invoked. So create a `NotificationsListener.tsx` file in **components** folder with the following code

```typescript
// components/NotificationsListener.tsx

"use client";

import React from "react";
import useFcmToken from "@/hooks/useFcmToken";

const NotificationsListener = () => {
    // Fetches the fcm token and registers an eventListener to show notifications
    // while app is in foreground
    useFcmToken();

    return <></>;
};

export default NotificationsListener;
```

This component is only responsible for invoking the `useFcmToken()` hook, rest is done by the hook. Import this component in `app/page.tsx` file

```typescript
// app/page.tsx
import NotificationsListener from "@/components/NotificationsListener";

export default async function Home() {
    return (
        <div className="flex">
            <NotificationsListener />
        </div>
    );
}
```

And thats pretty much it! We have successfully integrated push notifications from firebase into our Nextjs application

# Testing

In order to test that everything is working fine or not, spin up your nextjs server and see for token logs in console.
If thats working, it means that we have successfully connected to firebase and started receiving tokens from them.

![](/blogs-screenshots/fcm_token.png)

Next, go to your firebase [console](https://console.firebase.google.com/u/0/) and scroll down until you find **Cloud Messaging**.
Click on it and you will be navigated to Messaging page. From their, click on **Create your first campaign** and then select
**Firebase Notification messages** and click **Create**

Now you will see a form where you can enter your notification title and text. Enter notification text because it is compulsory,
and click **Send test message**. Now a popup will appear asking you for FCM token.
Copy and paste the token from console into the popup and click the **+** button next to it, and click **Test** button.
You will then receive a notification

![](/blogs-screenshots/send_test_notif.png)
![](/blogs-screenshots/test-notif.png)

That's pretty much it! Good luck building your project 🚀
