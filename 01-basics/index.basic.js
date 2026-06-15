import { ask as askOpenAI } from './01-http.js';
import { ask as streamOpenai } from './02-stream.js';

const messages = [
  {
    role: 'system',
    content: 'You are a helpful and concise geography expert.',
  },
  { role: 'user', content: 'What is the capital of France?' },
];


// --- 1. HTTP OpenAI Compatible (/v1/chat/completions) ---
try {
  const resultHttpOpenAI = await askOpenAI(messages);
  console.log('Result from OpenAI:', resultHttpOpenAI);
} catch (error) {
  console.error('Error while asking OpenAI:', error);
}

// --- 2. Streaming OpenAI Compatible (/v1/chat/completions) ---
try {
  const tokenStream = streamOpenai(messages);

  process.stdout.write('Streaming response from OpenAI: ');
  for await (const token of tokenStream) {
    process.stdout.write(token);
  }
  console.log('\n');
} catch (error) {
  console.error('Error while streaming OpenAI:', error);
}