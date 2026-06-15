import express from 'express';
import { McpServer } from '@modelcontextprotocol/server';
import { NodeStreamableHTTPServerTransport } from '@modelcontextprotocol/node';
import { z } from 'zod';
import { createServer } from '../server/server.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Essential middleware for parsing JSON bodies
app.use(express.json());
app.use(cors());

// 1. Initialize the core MCP Server
const server = createServer();
// 3. Create the Streamable HTTP Endpoint
app.post('/mcp', async (req, res) => {
  try {
    // Instantiate a separate transport lifecycle mapping for the request context
    const transport = new NodeStreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // Uses default UUID generation if left undefined
    });

    // Connect the MCP server instance to this specific transport channel
    await server.connect(transport);

    // Delegate request handling, request body parsing, and chunked response streaming to the transport layer
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('Error handling MCP streamable-http request:', error);

    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error processing Streamable HTTP payload.',
        },
        id: null,
      });
    }
  }
});

// Start the Express Server
app.listen(PORT, () => {
  console.log(
    `🚀 Streamable HTTP MCP Server actively running on http://localhost:${PORT}/mcp`,
  );
});

