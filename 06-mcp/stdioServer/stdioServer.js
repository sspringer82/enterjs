import { StdioServerTransport } from '@modelcontextprotocol/server';
import { createServer } from '../server/server.js';

try {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
} catch (error) {
  console.error('Fatal error:', error);
  process.exit(1);
}

