import {
  Annotation,
  StateGraph,
  START,
  END,
  MemorySaver,
} from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const GraphState = Annotation.Root({
  sourceLang: Annotation(),
  targetLang: Annotation(),
  userInput: Annotation(),
  translation: Annotation(),
});

const llm = new ChatOpenAI({
  configuration: { baseURL: 'http://localhost:11434/v1' },
  apiKey: 'ollama',
  model: 'llama3.2:1b',
});

// --- FAULT TOLERANCE SIMULATION SETUP ---
let hasCrashed = false;

async function inputNode(state) {
  const rl = readline.createInterface({ input, output });
  console.log(
    `\n--- translating from ${state.sourceLang} to ${state.targetLang} ---`,
  );
  const answer = await rl.question('Enter text: ');
  rl.close();
  return { userInput: answer.trim() };
}

async function translationNode(state) {
  console.log('Attempting translation...');

  // Simulate a sudden crash/error on the first attempt
  if (!hasCrashed) {
    hasCrashed = true; // Next time it will succeed
    console.log(
      '\n❌ [CRITICAL ERROR]: Connection to Ollama lost mid-execution! App crashed.',
    );
    throw new Error('Ollama API Timeout');
  }

  // If we survive the crash simulation, run normally:
  const prompt = `Translate ${state.userInput} from ${state.sourceLang} to ${state.targetLang}. Return only translation.`;
  const response = await llm.invoke(prompt);

  console.log('\n================ RESULT ================');
  console.log(`Translation: ${response.content}`);
  console.log('========================================\n');

  return { translation: response.content };
}

// Build the workflow (Notice: no infinite loop back to inputNode here)
const workflow = new StateGraph(GraphState)
  .addNode('getInput', inputNode)
  .addNode('translateText', translationNode)
  .addEdge(START, 'getInput')
  .addEdge('getInput', 'translateText')
  .addEdge('translateText', END);

const checkpointer = new MemorySaver();
const graph = workflow.compile({ checkpointer });

const config = { configurable: { thread_id: 'crash_test_thread' } };

try {
  console.log('=== FIRST ATTEMPT ===');
  // We provide the initial setup variables
  await graph.invoke(
    {
      sourceLang: 'English',
      targetLang: 'Spanish',
    },
    config,
  );
} catch (error) {
  console.log(`\nCaught Expected Exception: "${error.message}"`);
  console.log('State was preserved up to the last successful checkpoint.');

  console.log('\n=== RESUMING WORKFLOW FROM CHECKPOINT ===');
  // We pass an empty input object {} and the SAME config thread ID.
  // LangGraph automatically recognizes that 'getInput' finished successfully
  // last time and goes straight back to 'translateText'.
  await graph.invoke(null, config);
}
