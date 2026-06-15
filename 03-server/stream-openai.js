import { Readable } from 'node:stream';
import readline from 'node:readline';

const baseUrl = 'http://localhost:11434';
const apiPath = '/v1/chat/completions';
const model = 'llama3.2:1b';

export async function* ask(messages) {
  const response = await fetch(`${baseUrl}${apiPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  });

  const nodeStream = Readable.fromWeb(response.body);

  const lines = readline.createInterface({
    input: nodeStream,
    crlfDelay: Infinity,
  });

  for await (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed === 'data: [DONE]') {
      continue;
    }

    if (trimmed.startsWith('data: ')) {
      const jsonStr = trimmed.slice(6);

      try {
        const data = JSON.parse(jsonStr);
        const token = data.choices[0]?.delta?.content;

        if (token) {
          yield token;
        }
      } catch (err) {
        console.error('Error parsing stream chunk:', err);
      }
    }
  }
}
