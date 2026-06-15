document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chat-form');
  const promptInput = document.getElementById('prompt');
  const messages = document.getElementById('messages');
  const submitButton = form.querySelector('button');

  function addMessage(role, text) {
    const element = document.createElement('article');
    element.className = `message ${role}`;
    element.textContent = text;
    messages.appendChild(element);
    messages.scrollTop = messages.scrollHeight;
    return element;
  }

  async function streamReply(prompt) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok || !response.body) {
      throw new Error('Request failed.');
    }

    const replyElement = addMessage('assistant', '');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      replyElement.textContent += decoder.decode(value, { stream: true });
      messages.scrollTop = messages.scrollHeight;
    }

    replyElement.textContent += decoder.decode();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const prompt = promptInput.value.trim();

    if (!prompt) {
      return;
    }

    addMessage('user', prompt);
    promptInput.value = '';
    submitButton.disabled = true;

    try {
      await streamReply(prompt);
    } catch (error) {
      addMessage(
        'assistant',
        'Sorry, something went wrong while contacting Ollama.',
      );
      console.error(error);
    } finally {
      submitButton.disabled = false;
      promptInput.focus();
    }
  });
});
