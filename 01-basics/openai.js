import OpenAI from 'openai';

const baseUrl = 'http://localhost:11434';
const apiPath = '/v1';
const model = 'llama3.2:1b';

const openai = new OpenAI({
  baseURL: `${baseUrl}${apiPath}`,
  apiKey: 'ollama',
});

export async function askOpenai(messages) {
  const response = await openai.chat.completions.create({
    model,
    messages,
  });

  return response.choices[0].message.content;
}

export async function streamOpenai(messages) {
  const response = await openai.chat.completions.create({
    model,
    messages,
    stream: true,
  });

  return response;
}