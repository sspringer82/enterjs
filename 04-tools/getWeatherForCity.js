export function getWeatherForCity({ city }) {
  const weatherMap = {
    Berlin: 'Sunny 10°C',
    'New York': 'Cloudy 14°C',
    'Los Angeles': 'Rainy 16°C',
  };
  return weatherMap[city] || 'Unknown';
}

export const description = {
  type: 'function',
  function: {
    name: 'get_weather_for_city',
    description: 'Get the current weather for a given city name',
    parameters: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description:
            'The city to get the weather for (e.g., Berlin, New York)',
        },
      },
      required: ['city'],
    },
  },
};
