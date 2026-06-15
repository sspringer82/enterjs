import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { HumanMessage } from '@langchain/core/messages';

function contentToString(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';

  return content
    .map((part) => (typeof part === 'string' ? part : (part?.text ?? '')))
    .join('');
}

function resultToString(result) {
  if (result && typeof result === 'object' && 'content' in result) {
    return contentToString(result.content);
  }
  return typeof result === 'string' ? result : String(result ?? '');
}

export async function cliChat(
  prompt,
  aiFn,
  handleResult,
  { sessionId = 'langchain-cli' } = {},
) {
  const rl = readline.createInterface({ input, output });

  console.log(`${prompt}\n`);

  try {
    while (true) {
      const userInput = await rl.question('You: ');

      if (userInput.trim().toLowerCase() === 'exit') {
        console.log('\nGoodbye!');
        break;
      }

      const result = await aiFn({
        userInput,
        userMessage: new HumanMessage(userInput),
        sessionId,
      });
      const assistantText = resultToString(result);
      await handleResult(assistantText, result);

      console.log();
    }
  } catch (error) {
    console.error('Error during chat:', error);
  } finally {
    rl.close();
  }
}
