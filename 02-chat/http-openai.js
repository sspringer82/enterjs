const baseUrl = 'http://localhost:11434';
const apiPath = '/v1/chat/completions';
const model = 'llama3.2:1b';

export async function ask(messages) {
  const response = await fetch(`${baseUrl}${apiPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
    }),
  });

  const data = await response.json();

  return data.choices[0].message.content;
}
