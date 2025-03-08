---
title: 'Create a chatapplication in Nextjs with Ably realtime'
date: '3-9-2025' # follows mm-dd-yyyy format
tags: ['Nextjs', 'Chat App', 'Realtime']
summary: "This blog explores how to build a real-time chat app using Next.js and the Ably Chat SDK. It walks through setting up Ably, managing authentication, and implementing real-time messaging with features like presence indicators and message history. By the end, you'll have a fully functional chat app with smooth, scalable real-time communication"
---

# Introduction

Ably Realtime is a solution for adding realtime features into you **serverless** applications. They provide a lot of
features out of the box. All you need to do is just call their hooks!

Let’s build a chat application in nextjs with ably realtime in just couple of minutes

## Install and Setup Ably

Install ably and it’s chat sdk

```bash
bun add ably @ably/chat
```

# Authenticating connection requests

Create an api route for authenticating socket requests with ably using tokens. I am using Clerkjs for authentication
so here, I am using it to fetch the authenticated user.

```typescript
// app/api/ably-authenticate/route.ts

import { usersDB } from '@/data/users.data';
import { auth } from '@clerk/nextjs/server';
import * as Ably from 'ably';

// ensure Vercel doesn't cache the result of this route,
// as otherwise the token request data will eventually become outdated
// and we won't be able to authenticate on the client side
export const revalidate = 0;

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = await usersDB.findByClerkId(userId);
  if (!user) {
    return Response.json({ error: 'Account not found' }, { status: 404 });
  }

  const client = new Ably.Rest({
    key: process.env.ABLY_API_KEY,
  });
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: user.username,
  });
  return Response.json(tokenRequestData);
}
```

Now we will need to initialize a connection request so that we can use ably in our app. This should be done in client components only!

```jsx
// app/page.tsx
'use client';
import { ChatClient, ChatClientProvider } from '@ably/chat';
import { Realtime } from 'ably';

// Connect to ably
const ably = new Realtime({
  authUrl: 'http://localhost:3000/api/ably-authenticate', // This is the api route we created previously
});
const client = new ChatClient(ably);

export default function Page() {
  return (
    <ChatClientProvider client={client}>
      <ChatRoomProvider id={'my-room'} options={RoomOptionsDefault}>
        {/* <your ui here> */}
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}
```

Here, `RoomOptionsDefault` is a set of room attributes like typing, presence etc. They are needed to enable and disable certain features in our chat application

More importantly, the `id` option must be unique, like if you have a whatsapp like contacts list, you will have to loop over them and provide each `<ChatRoomProvider />` a unique id.

After this we just need to use the hooks provided by the ably chat sdk and we will have a functioning chat application.

# useMessages() Hook

To send and receive messages we can use useMessages() hook.

### Receiving Messages

```jsx
// components/messages-list.tsx
'use client';

export default function MessagesList() {
  const [messagesList, setMessagesList] = useState<Message[]>([]);

  useMessages({
    listener: (event) => {
      const { clientId, text } = event.message;
      setMessagesList([...messagesList, { clientId, text }]);
      scrollMessageList();
    },
  });

  return (
    <div
      ref={messagesListRef}
      className="overflow-y-auto p-4 space-y-2 w-full bg-base-100 scroll-smooth flex-1"
    >
      {messagesList.map((message, idx) => (
        <div
          key={idx}
          className={`chat ${
            message.clientId === friend.username ? 'chat-start' : 'chat-end'
          }`}
        >
          <div className="chat-bubble bg-neutral text-lg ">
            {message.text.trim()}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Sending Messages

```jsx
// components/message-input-box.tsx
'use client';

import { useState, ChangeEvent } from 'react';
import { useMessages, useTyping } from '@ably/chat';

export default function MessageInputBox() {
  const { send } = useMessages();

  // This broadcasts "typing" events which are then used to
  // display the typing indicator
  const { start } = useTyping();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage(value);
    setCursorPosition(e.target.selectionStart || 0);
    start();
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    send({ text: message });
    setMessage('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative p-3 pb-4 bg-base-100 w-full border border-x-0 border-b-0 border-neutral"
    >
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message"
          className="input bg-base-200 input-bordered rounded-md w-full flex-1"
          value={message}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="btn btn-info btn-square rounded-md"
          aria-label="send-btn"
        >
          Send
        </button>
      </div>
    </form>
  );
}
```

Here, `useTyping()` hook is used along with the `send()` function provided by `useMessages()` hook. This will
broadcast the "typing" events (or however ably handles typing stuff). Then a listener will catch these events
and show the typing indicator (see below).

`useMessages()` hook also provides a 24 hour messages persistence feature, after that the messages are deleted.
So to permenently store messages, you can create your own database using MongoDB or Supabase or any other provider.
Then register a batch webhook on Ably’s website. This webhook will make requests to your nextjs server with the list of messages, then you can store these messages in your own database.

# useTyping() Hook

To display a typing indicator text, we can use useTyping() hook. A listener will be created for receiving typing
events from ably and then they will be used to show the typing indicator text

```jsx
// components/typing-indicator.tsx
'use client';
import { useState } from 'react';

export default function TypingIndicator() {
  const [typingUser, setTypingUser] = useState('');

  const { error } = useTyping({
    listener: ({ currentlyTyping }) => {
      if (currentlyTyping.size < 1) {
        setTypingUser(''); // Removes the typing indicator
        return;
      }
      currentlyTyping.forEach((username) => {
        setTypingUser(username);
      });
    },
  });

  return (
    <>
      {/* Ty}ping indicator */}
      {error && <p className="text-error">{error.message}</p>}
      {typingUser && (
        <div className="w-full flex items-center gap-3 px-4 py-2 rounded-t-lg bg-base-200">
          <>
            <span className="loading loading-dots loading-sm"></span>
            <p>{typingUser} is typing...</p>
          </>
        </div>
      )}
    </>
  );
}
```

That’s it for today folks!

Happy coding 🚀
