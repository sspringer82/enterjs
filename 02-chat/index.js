import { cliChat } from './cliChat.js';
import { ask } from './http-openai.js';
// askOpenAI

/*
function handleAskResult(result) {
  console.log(`AI: ${result}`);
  return result;
}

cliChat("AI Ready! Ask anything (type 'exit' to quit).", ask, handleAskResult);
*/

// streamOpenAI

async function handleStreamResult(tokenStream) {
  process.stdout.write('AI: ');
  let result = '';
  for await (const token of tokenStream) {
    result += token;
    process.stdout.write(token);
  }
  return result;
}

cliChat(
  "AI Ready! Ask anything (type 'exit' to quit).",
  ask,
  handleStreamResult,
);
