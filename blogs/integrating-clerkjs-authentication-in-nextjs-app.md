---
title: 'Nextjs + Clerkjs Guide - Integrate authentication seamlessly'
date: '2-7-2025' # follows mm-dd-yyyy format
tags: ['Nextjs', 'Clerk', 'Authentication', 'Next 15', 'Vercel']
summary: 'Clerkjs makes it easy to add top grade authentication in our applications with ease. With just few steps, we can have access to Social authentication, Traditional email/pass auth, 2FA authentication and much more! But, there are also some issues that beginners face in setting up clerkjs. So we will be going over those issues so that everyone can benefit from amazing authentication service of clerkjs'
---

I know that clerk.js already have a decent documentation on their website and it's quite easy to integrate it. But! there are some problems that beginners face. I will be going over those issues so that you (and future me) can easily integrate clerkjs in our nextjs application

# Setup

First create an account on Clerkjs website and create an application. Select your authentication methods while creating the app
![](/blogs-screenshots/clerk_create_application.png)
Then follow Clerkjs documentation for Nextjs [here](https://clerk.com/docs/quickstarts/nextjs). After you have integrated Clerkjs and authentication is working now do the following changes in the `middleware.ts` file

```typescript
// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // <--- Remove lines from here that look like /(api|trpc)
  ],
};
```

What it does is that it removes auth protection from `/api` routes. These help in registering a Webhook and you can manually create protected routes

# Protecting Routes

Now we will protect our api routes and other routes using `createRouteMatcher` exported from clerkjs.

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/',
  '/add-users',
  '/settings',
  '/pending-requests',
  '/api/webhook',
  '/api/search-users',
]);
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
```

Now with this setup the clerkjs middleware will protect our given routes and we will be pretty much good to go

> When you try to access a protected route from `curl` or maybe Postman, it will return **404** status code.
> This thing confused me when I was first integerating Clerkjs and wasted some hours of useless debugging until I realized it myself

Happy Coding! 🚀
