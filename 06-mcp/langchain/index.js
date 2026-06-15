import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent } from 'langchain';

const client = new MultiServerMCPClient({
  weather: {
    transport: 'stdio',
    command: 'node',
    args: ['../stdioServer/stdioServer.js'],
  },
  // weather: {
  //   transport: 'http',
  //   url: 'http://localhost:3000/mcp',
  // },
});

const model = new ChatOpenAI({
  configuration: {
    baseURL: 'http://localhost:11434/v1',
  },
  apiKey: 'ollama',
  model: 'llama3.2:1b',
});

const tools = await client.getTools();

const agent = createAgent({
  model,
  tools,
});

const weatherResponse = await agent.invoke({
  messages: [{ role: 'user', content: 'what is the weather in Berlin?' }],
});

console.log(
  'Weather response:',
  weatherResponse.messages[weatherResponse.messages.length - 1].content,
);

process.exit(0);
