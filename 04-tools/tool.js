import { completeOpenai } from './openai.js';
import { executeToolCalls } from './executeToolCalls.js';
import { getWeatherForCity, description } from './getWeatherForCity.js';

const model = 'llama3.2:3b';

const availableTools = {
  get_weather_for_city: getWeatherForCity,
};

const messages = [
  {
    role: 'system',
    content:
      'You are a helpful AI that can use a weather service. Answer the user question using the tool response. If the tool returns "Unknown", tell the user "I don\'t know".',
  },
  {
    role: 'user',
    content: 'What is the current weather in NY?',
  },
];

async function main() {
  console.log(`User: ${messages[1].content}\n`);

  // ----- 1. Erster Modell-Aufruf -----
  const firstResponse = await completeOpenai(messages, [description]);
  messages.push(firstResponse);

  const toolCalls = firstResponse.tool_calls ?? [];

  // ----- 2. Tools ausführen (falls vorhanden) -----
  if (toolCalls.length > 0) {
    await executeToolCalls(toolCalls, messages, availableTools);

    // ----- 3. Finaler Modell-Aufruf nach Tool-Ergebnissen -----
    console.log('\nGenerating final answer based on tool data...');
    const finalResponse = await completeOpenai(messages);
    console.log(`\nAI: ${finalResponse.content}`);
  } else {
    // Keine Tools aufgerufen, direkte Antwort nutzen
    console.log(`\nAI: ${firstResponse.content}`);
  }
}

main().catch(console.error);
