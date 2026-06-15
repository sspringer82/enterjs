import {
  Annotation,
  StateGraph,
  START,
  END,
  MemorySaver,
} from '@langchain/langgraph'; // 1. Added MemorySaver
import { ChatOpenAI } from '@langchain/openai';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// 1. Define the Graph State Schema
const GraphState = Annotation.Root({
  sourceLang: Annotation(),
  targetLang: Annotation(),
  userInput: Annotation(),
  translation: Annotation(),
});

// 2. Initialize the Ollama model
const llm = new ChatOpenAI({
  configuration: {
    baseURL: 'http://localhost:11434/v1',
  },
  apiKey: 'ollama',
  model: 'llama3.2:1b',
});

// 3. Define the Nodes
async function inputNode(state) {
  const rl = readline.createInterface({ input, output });

  console.log(
    `\n--- Ready to translate from ${state.sourceLang} to ${state.targetLang} (Type 'exit' to quit) ---`,
  );
  const answer = await rl.question('Enter text: ');
  rl.close();

  return { userInput: answer.trim() };
}

async function translationNode(state) {
  console.log('Translating...');

  const prompt = `You are a professional translator. Translate the following text from ${state.sourceLang} to ${state.targetLang}. 
Do not provide any conversational text or explanation. Only return the exact translation.

Text: "${state.userInput}"`;

  const response = await llm.invoke(prompt);

  console.log('\n================ RESULT ================');
  console.log(`Original:    ${state.userInput}`);
  console.log(`Translation: ${response.content}`);
  console.log('========================================\n');

  return { translation: response.content };
}

// 4. Define the Routing Logic
function checkUserIntent(state) {
  if (state.userInput.toLowerCase() === 'exit') {
    console.log('Goodbye!');
    return 'end';
  }
  return 'continue';
}

// 5. Construct the Graph Workflow
const workflow = new StateGraph(GraphState)
  .addNode('getInput', inputNode)
  .addNode('translateText', translationNode)
  .addEdge(START, 'getInput')
  .addConditionalEdges('getInput', checkUserIntent, {
    continue: 'translateText',
    end: END,
  })
  // .addEdge('translateText', 'getInput');
  .addEdge('translateText', END);

// 2. Instantiate the memory checkpointer
const checkpointer = new MemorySaver();

// 3. Compile the graph WITH the checkpointer
const graph = workflow.compile({ checkpointer });

// 4. Define a configuration with a unique thread_id
const config = { configurable: { thread_id: 'translation_session_1' } };

// Start the graph execution loop, passing the config
await graph.invoke(
  {
    sourceLang: 'English',
    targetLang: 'Spanish',
  },
  config,
);

console.log('Starting Session 2 (Resuming from history)... recalls english');
await graph.invoke({}, config);
