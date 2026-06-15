import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ask } from './stream-openai.js';

const app = express();
const port = process.env.PORT || 3000;
const publicDir = path.join(import.meta.dirname, 'public');

app.use(express.json());
app.use(express.static(publicDir));

app.post('/api/chat', async (req, res) => {
  const prompt = req.body?.prompt?.trim();

  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required.' });
    return;
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    for await (const chunk of ask(prompt)) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    console.error('Chat request failed:', error);

    if (!res.headersSent) {
      res.status(500).json({ error: 'Could not reach Ollama.' });
      return;
    }

    res.write('\n\n[Error: Could not reach Ollama.]');
    res.end();
  }
});

app.listen(port, () => {
  console.log(`Chat app running at http://localhost:${port}`);
});
