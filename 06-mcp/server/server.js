import { McpServer } from '@modelcontextprotocol/server';
import { registerWeatherTool } from './registerWeatherTool.js';
import { registerWeatherPrompt } from './registerWeatherPrompt.js';
import { registerCityResource } from './registerCityResource.js';

export function createServer() {
  const server = new McpServer({
    name: 'weather',
    version: '1.0.0',
  });

  registerWeatherTool(server);
  registerWeatherPrompt(server);
  registerCityResource(server);

  return server;
}

