import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export async function cliChat(prompt, aiFn, handleResult) {
  const rl = readline.createInterface({ input, output });
  console.log(`${prompt}\n`);

  const history = [
    { role: 'system', content: 'You are a helpful AI assistant.' },
  ];

  try {
    while (true) {
      const userInput = await rl.question('You: ');

      if (userInput.toLowerCase().trim() === 'exit') {
        console.log('\nGoodbye!');
        break;
      }

      history.push({ role: 'user', content: userInput });

      const result = await aiFn(history);

      const assistantReply = await handleResult(result);
      history.push({ role: 'assistant', content: assistantReply });
      console.log();
    }
  } catch (error) {
    console.error('Error during chat:', error);
  } finally {
    rl.close();
  }
}
