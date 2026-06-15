import { z } from 'zod';

const WeatherArgsSchema = z.object({
  city: z.string().describe('The name of the city to get the weather for.'),
});

const WeatherResultSchema = z.object({
  weather: z
    .string()
    .describe(
      'The current weather for the specified city, or "Unknown" if the city is not in the database.',
    ),
});

export function registerWeatherTool(server) {
  server.registerTool(
    'getWeatherForCity',
    {
      title: 'Get Weather for City',
      description: 'Get the current weather for a specified city.',
      inputSchema: WeatherArgsSchema,
      outputSchema: WeatherResultSchema,
    },
    async ({ city }) => {
      const weatherData = {
        Berlin: 'Sunny, 20°C',
        'New York': 'Cloudy, 15°C',
        'Los Angeles': 'Rainy, 18°C',
      };

      const output = {
        weather: weatherData[city] || 'Unknown',
      };

      return {
        content: [
          {
            type: 'text',
            text: output.weather,
          },
        ],
        structuredContent: output,
      };
    },
  );
}
