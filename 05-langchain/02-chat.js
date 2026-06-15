import { InMemoryChatMessageHistory } from '@langchain/core/chat_history';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import { ChatOpenAI } from '@langchain/openai';
import { cliChat } from './cliChat.js';

// ==========================================
// 1. INITIALIZATION & CONFIGURATION
// ==========================================

const model = new ChatOpenAI({
  configuration: {
    baseURL: 'http://localhost:11434/v1',
  },
  apiKey: 'ollama',
  model: 'llama3.2:1b',
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    'You are a helpful AI. Please explain the following colors in one sentence each.',
  ],
  new MessagesPlaceholder('history'),
  ['human', '{question}'],
]);

const parser = new StringOutputParser();

const baseChain = prompt.pipe(model).pipe(parser);
const histories = new Map();

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: baseChain,
  getMessageHistory: (sessionId) => {
    if (!histories.has(sessionId)) {
      histories.set(sessionId, new InMemoryChatMessageHistory());
    }

    return histories.get(sessionId);
  },
  inputMessagesKey: 'question',
  historyMessagesKey: 'history',
});

// ==========================================
// 3. INTERACTIVE CLI LOOP
// ==========================================

async function chatWithHistory({ userInput, sessionId }) {
  return chainWithHistory.invoke(
    { question: userInput },
    { configurable: { sessionId } },
  );
}

async function handleChatResult(result) {
  console.log(`AI: ${result}`);
  return result;
}

cliChat(
  "Color AI Ready! Ask about any color (type 'exit' to quit).",
  chatWithHistory,
  handleChatResult,
);
