import { streamOpenai } from './openai.js';

const messages = [
  {
    role: 'system',
    content: 'You are a helpful and concise geography expert.',
  },
  { role: 'user', content: 'What is the capital of France?' },
];

try {
  const tokenStream = await streamOpenai(messages);

  process.stdout.write('Streaming response from OpenAI: ');
  for await (const token of tokenStream) {
    const content = token.choices[0].delta.content;
    process.stdout.write(content);
  }
  console.log('\n');
} catch (error) {
  console.error('Error while streaming OpenAI:', error);
}
