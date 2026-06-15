import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent } from 'langchain';

const client = new MultiServerMCPClient({
  // weather: {
  //   transport: 'stdio',
  //   command: 'node',
  //   args: ['../stdioServer/stdioServer.js'],
  // },
  weather: {
    transport: 'http',
    url: 'http://localhost:3210/mcp',
  },
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

const finalMessage = weatherResponse.messages[weatherResponse.messages.length - 1];
const usage =
  finalMessage?.usage_metadata ?? finalMessage?.response_metadata?.tokenUsage;

console.log(
  'Weather response:',
  finalMessage?.content,
);
console.log('Token usage:', usage ?? 'not available');

process.exit(0);

// Initialisierung mit Tool-Definition
// user: wie ist das weter in NY?
// modell: ruf mir bitte das tool auf mit NY?
// MCP tool call mit NY
// tool: sonnig 20 grad
// modell: in NY ist es sonnig und 20 grad
