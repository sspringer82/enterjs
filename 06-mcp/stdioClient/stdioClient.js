import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client';

const mcp = new Client({ name: 'mcp-client-cli', version: '1.0.0' });

const transport = new StdioClientTransport({
  command: 'node',
  args: ['stdioServer/stdioServer.js'],
});
await mcp.connect(transport);

// list prompts
const prompts = await mcp.listPrompts({});
console.log('Prompts:', prompts.prompts);

// call prompt
const prompt = await mcp.getPrompt({
  name: 'weather-query-template',
  arguments: { city: 'Berlin' },
});
console.log('Prompt:', prompt);

// list resources
const resources = await mcp.listResources({});
console.log('Resources:', resources.resources);

// call resource
const resource = await mcp.readResource({
  uri: 'https://example.com/cities',
});
console.log('Resource:', resource);

// list tools
const tools = await mcp.listTools({});
console.log('Tools:', tools.tools);

// call tool
const tool = await mcp.callTool({
  name: 'getWeatherForCity',
  arguments: { city: 'Berlin' },
});
console.log('Tool:', tool);

