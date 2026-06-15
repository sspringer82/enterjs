import { Client } from '@modelcontextprotocol/client';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/client';

// 1. Initialisiere den MCP Client
const mcp = new Client(
  {
    name: 'mcp-client-http',
    version: '1.0.0',
  },
  {
    capabilities: {}, // Hier kannst du bei Bedarf Client-Capabilities definieren
  },
);

// 2. Erstelle den Streamable HTTP Transport
// Ersetze die URL mit der Adresse deines Express-Servers aus dem vorherigen Schritt
const transport = new StreamableHTTPClientTransport(
  'http://localhost:3000/mcp',
);

// 3. Verbindung aufbauen
console.log('Verbinde mit Streamable HTTP MCP Server...');
await mcp.connect(transport);
console.log('Verbindung erfolgreich hergestellt!\n');

// --- Ab hier bleibt die Logik exakt identisch zu deinem Stdio-Client ---

try {
  // list prompts
  const prompts = await mcp.listPrompts({});
  console.log('Prompts:', prompts.prompts);
} catch (e) {
  console.log('Prompts nicht unterstützt oder Fehler:', e.message);
}

try {
  // call prompt
  const prompt = await mcp.getPrompt({
    name: 'weather-query-template',
    arguments: { city: 'Berlin' },
  });
  console.log('Prompt:', prompt);
} catch (e) {
  console.log('Prompt-Aufruf fehlgeschlagen:', e.message);
}

try {
  // list resources
  const resources = await mcp.listResources({});
  console.log('Resources:', resources.resources);
} catch (e) {
  console.log('Resources nicht unterstützt oder Fehler:', e.message);
}

try {
  // call resource
  const resource = await mcp.readResource({
    uri: 'https://example.com/cities',
  });
  console.log('Resource:', resource);
} catch (e) {
  console.log('Resource-Abruf fehlgeschlagen:', e.message);
}

try {
  // list tools
  const tools = await mcp.listTools({});
  console.log('Tools:', tools.tools);
} catch (e) {
  console.log('Tools nicht unterstützt oder Fehler:', e.message);
}

try {
  // call tool
  // Hinweis: Wenn du den Server aus der vorherigen Antwort nutzt, heißt das Tool dort 'get_weather' statt 'getWeatherForCity'
  const tool = await mcp.callTool({
    name: 'getWeatherForCity', // angepasst an das Server-Beispiel
    arguments: { city: 'Berlin' },
  });
  console.log('Tool:', tool);
} catch (e) {
  console.log('Tool-Aufruf fehlgeschlagen:', e.message);
}

// Verbindung sauber trennen, wenn fertig
await mcp.close();
