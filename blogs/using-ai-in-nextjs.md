---
title: 'How to get started with using AI in Nextjs'
date: '3-16-2025' # follows mm-dd-yyyy format
tags: ['Nextjs', 'AI']
summary: "This blog provides a short guide for developers looking to integrate AI capabilities into their Next.js applications using Hugging Face's powerful machine learning models. The author explains the basics of Hugging Face, a platform that offers a wide range of pre-trained models for natural language processing (NLP), computer vision, and more"
---

With all this AI hype going around, you may have clients that ask you to build an AI application for their
business or integrate AI in their existing applications or you just want to try out AI in your personal projects.

Whatever your reason is, read this blog to find out how to get started with it!

## Get started with AI for FREE

There are plenty of paid AI models out there like ChatGPT, Gemini, Claude, Perplexity etc offering generous
subscriptions. However if you are just starting out you may need to test the model to check if it suit your
use-case or not.

For that, go to [Hugging Face IO](https://huggingface.co/). It’s an AI platform that includes a lot of AI models that you can use for free like FLUX.1-dev (for image generation), Stable Diffusion models (for swapping faces) and many more

## How to use Hugging Face

First create an account on Hugging Face website and verify your email. After that, you can explore their models
and test them out.

They have various AI models in their **Models** section categorized based on their work like Speech synthesis,
Image generation, Video generation, Text-to-Text, Diffusion AIs etc.

You can open these models and give them a prompt to see how well they work.

Here, you have two options, either you can host the model yourself using several options they provide like
Spaces, Inference API etc.

The easiest way is to use the already hosted model. Go to **Spaces page** and select the category and then the
model you want to use. Scroll down until you see the “Use via API” button. Click that and it will provide you a
gradio client code snippet to use.

```javascript
import { Client } from '@gradio/client';

const client = await Client.connect('<model_url>');
const result = await client.predict('/infer', {
  // You may see another url like /predit
  prompt: 'Hello!!',
});

console.log(result.data);
```

You can run this gradio client snippet in server actions OR route handlers of nextjs to use the AI model in your
application.

However this uses the anonymous account and provides very few minutes for testing out the model.

You will need to provide it an access token. Go to [hugging face website](https://huggingface.co/). Click on your
avatar in the top right corner > Access Tokens > Create new token. Make sure to select read permissions for the
token. Then copy the access token in your `.env` file.

Now you can use this token in your hugging face model like so

```javascript
import { Client } from "@gradio/client";

const client = await Client.connect("<model_url>", {
	hf_token: process.env.HF_ACCESS_TOKEN!
});
const result = await client.predict("/infer", {  	// You may see another url like /predit
		prompt: "Hello!!",
});

console.log(result.data);
```

And that’s all!

Happy Coding 🚀
