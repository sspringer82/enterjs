import { z } from 'zod';

export function registerWeatherPrompt(server) {
  server.registerPrompt(
    'weather-query-template',
    {
      description:
        'Prompt template to ask for the current weather of a given city',
      argsSchema: z.object({
        city: z.string().describe('The city to get the current weather for'),
      }),
    },
    async ({ city }) => {
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `What is the current weather in ${city}?`,
            },
          },
        ],
      };
    },
  );
}
