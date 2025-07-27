// // /services/llm.js
// import OpenAI from 'openai';
// import dotenv from 'dotenv';

// dotenv.config();

// const apiKey = process.env.OPENAI_API_KEY;
// if (!apiKey) {
//   throw new Error('OPENAI_API_KEY missing in environment');
// }
// const openai = new OpenAI({ apiKey });

// export async function llmGenerateComponent(prompt, settings = {}) {
//   const system = `
// You are a React code generator. Return ONLY valid JSON:
// {
//   "files": [{ "path": "Component.jsx", "code": "..." }],
//   "deps": { "react": "^18.2.0" }
// }
// - Use React with JSX.
// - No explanations, no backticks.
// `;

//   const completion = await openai.chat.completions.create({
//     model: 'gpt-4o-mini',
//     temperature: 0,
//     response_format: { type: 'json_object' },
//     messages: [
//       { role: 'system', content: system },
//       { role: 'user', content: JSON.stringify({ prompt, settings }) },
//     ],
//   });

//   const content = completion.choices?.[0]?.message?.content || '{}';
//   return JSON.parse(content);
// }

// export async function llmModifyComponent(code, instruction) {
//   const system = `
// You get a JSX React code snippet and an instruction. Return ONLY valid JSON:
// {"code":"<FULL UPDATED CODE HERE>"}
// No backticks, no explanations.
// `;

//   const completion = await openai.chat.completions.create({
//     model: 'gpt-4o-mini',
//     temperature: 0,
//     response_format: { type: 'json_object' },
//     messages: [
//       { role: 'system', content: system },
//       { role: 'user', content: JSON.stringify({ code, instruction }) },
//     ],
//   });

//   const content = completion.choices?.[0]?.message?.content || '{}';
//   return JSON.parse(content);
// }

// /services/llm.js
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY missing in environment');
}

const openai = new OpenAI({
  apiKey,
  baseURL: 'https://openrouter.ai/api/v1', // OpenRouter base URL
});

export async function llmGenerateComponent(prompt, settings = {}) {
  const system = `
You are a React code generator. Return ONLY valid JSON:
{
  "files": [{ "path": "Component.jsx", "code": "..." }],
  "deps": { "react": "^18.2.0" }
}
- Use React with JSX.
- No explanations, no backticks.
`;

  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4o-mini',  // OpenRouter model name
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: JSON.stringify({ prompt, settings }) },
    ],
  });

  const content = completion.choices?.[0]?.message?.content || '{}';
  return JSON.parse(content);
}

export async function llmModifyComponent(code, instruction) {
  const system = `
You get a JSX React code snippet and an instruction. Return ONLY valid JSON:
{"code":"<FULL UPDATED CODE HERE>"}
No backticks, no explanations.
`;

  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4o-mini',  // OpenRouter model name
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: JSON.stringify({ code, instruction }) },
    ],
  });

  const content = completion.choices?.[0]?.message?.content || '{}';
  return JSON.parse(content);
}
