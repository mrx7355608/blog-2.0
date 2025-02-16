---
title: 'Addition firebase notifications setup in nextjs'
date: '2-16-2025' # follows mm-dd-yyyy format
tags: ['Nextjs', 'Firebase', 'App router', 'Custom Notifications']
summary: 'So you have firebase cloud messaging up and running in your nextjs application. But, you want more control over your notifications. Read this blog to learn about different things we can do with our notifications!'
---

If you are coming from my [previous blog](/send-notification-in-nextjs-using-firebase-cloud-messaging) on integrating
notifications using fcm. Then you know that we had three adjustments that we needed to make:

1. Hiding firebase credentials
2. Handling notifications clicks
3. Showing an image in notifications

# Hiding hardcoded firebase credentials in Firebase service worker

If you have followed firebase official documentation or my blog [here](/send-notification-in-nextjs-using-firebase-cloud-messaging)
We have hardcoded our firebase credentials in `firebase-messaging-sw.js` file. Even tho they are safe to expose but, just
to be extra safe we must hide them some how.

I will be using route handlers to pass the environment variables object to my service worker. Create a `app/api/firebase-data/route.ts`
file that contains a `GET` method.

```typescript
// app/api/firebase-data/route.ts

export async function GET() {
  const loggedInUser = await currentUser();
  if (!loggedInUser) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  return Response.json(firebaseConfig, { status: 200 });
}
```

Now update your service worker to fetch these credentials from nextjs api and we are good to go!

```javascript
importScripts(
  'https://www.gstatic.com/firebasejs/11.3.1/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/11.3.1/firebase-messaging-compat.js',
);

// Initialize the Firebase app in the service worker
fetch('/api/firebase-data', { credentials: 'include' })
  .then((resp) => resp.json())
  .then((config) => {
    const app = firebase.initializeApp(config);
    const messaging = firebase.messaging(app);

    messaging.onBackgroundMessage((payload) => {
      console.log('Received background message: ', payload);
    });
  })
  .catch(console.log);
```
