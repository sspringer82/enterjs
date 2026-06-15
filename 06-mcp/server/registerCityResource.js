export function registerCityResource(server) {
  server.registerResource(
    'supported-cities',
    'https://example.com/cities',
    {
      title: 'Supported Cities',
      description: 'List of supported cities with optional country filtering',
      mimeType: 'application/json',
    },
    async ({ query }) => {
      // Vollständige Liste
      const cities = [
        { city: 'Berlin', country: 'Germany' },
        { city: 'New York', country: 'USA' },
        { city: 'Los Angeles', country: 'USA' },
      ];

      // Optionaler Filter: ?country=USA
      const filtered = query?.country
        ? cities.filter(
            (c) => c.country.toLowerCase() === query.country.toLowerCase(),
          )
        : cities;

      return {
        contents: [
          {
            uri: 'https://example.com/cities',
            text: JSON.stringify(filtered, null, 2),
          },
        ],
      };
    },
  );
}
