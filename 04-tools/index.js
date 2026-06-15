import { cliChat } from './cliChat.js';
import { completeOpenai } from './openai.js';
import { executeToolCalls } from './executeToolCalls.js';
import { getWeatherForCity, description } from './getWeatherForCity.js';

const availableTools = {
  get_weather_for_city: getWeatherForCity,
};

async function chatWithTools(messages) {
  const firstResponse = await completeOpenai(messages, [description]);
  const toolCalls = firstResponse.tool_calls ?? [];

  if (toolCalls.length === 0) {
    return firstResponse.content ?? '';
  }

  messages.push(firstResponse);
  await executeToolCalls(toolCalls, messages, availableTools);

  const finalResponse = await completeOpenai(messages);

  return finalResponse.content ?? '';
}

async function handleChatResult(result) {
  console.log(`AI: ${result}`);
  return result;
}

cliChat(
  "AI Ready! Ask for the weather in a city (type 'exit' to quit).",
  chatWithTools,
  handleChatResult,
);
