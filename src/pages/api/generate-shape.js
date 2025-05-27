// src/pages/api/generate-shape.js
import { OpenAI } from 'openai';

export const prerender = false;


const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

export async function POST({ request }) {
  const { prompt } = await request.json();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an assistant that returns JSON like { "type": "box", "width": 2, "height": 1, "depth": 1.5 }',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  const json = JSON.parse(completion.choices[0].message.content); // Important
  return new Response(JSON.stringify(json), {
    headers: { 'Content-Type': 'application/json' },
  });
}
