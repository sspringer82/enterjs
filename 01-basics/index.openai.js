import { streamOpenai } from './openai.js';

const messages = [
  {
    role: 'system',
    content: `
You are a helpful assistant that provides concise answers to questions.
if a user asks for a capital of a country, answer in json. Containing the keys country and city.
Example: What is the capital of France?
Answer:
{
  "country": "France",
  "city": "Paris"
}
    `
  },
  { role: 'user', content: 'What is the capital of Brazil?' },
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
