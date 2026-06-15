import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

// ==========================================
// 1. INITIALIZATION & CONFIGURATION
// ==========================================

const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    'You are a helpful assistant that translates text into a specified language.',
  ],
  ['user', 'Translate the following into {language}: {text}'],
]);

const model = new ChatOpenAI({
  configuration: {
    baseURL: 'http://localhost:11434/v1',
  },
  apiKey: 'ollama',
  model: 'llama3.2:1b',
});

const parser = new StringOutputParser();

// ==========================================
// 2. CHAIN CREATION
// ==========================================

const llmChain = await prompt.pipe(model).pipe(parser);

// ==========================================
// 3. CHAIN EXECUTION
// ==========================================

const result = await llmChain.invoke({
  language: 'german',
  text: 'Hello, how are you?',
});

console.log(result);
