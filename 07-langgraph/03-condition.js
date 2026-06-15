import { Annotation, StateGraph, START, END } from '@langchain/langgraph';
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

// Node A: Get user input from terminal
async function inputNode(state) {
  const rl = readline.createInterface({ input, output });

  console.log(
    `\n--- Ready to translate from ${state.sourceLang} to ${state.targetLang} (Type 'exit' to quit) ---`,
  );
  const answer = await rl.question('Enter text: ');
  rl.close();

  // Return updates to the state
  return { userInput: answer.trim() };
}

// Node B: Send data to Ollama for translation
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

// 4. Define the Routing Logic (Conditional Edge)
function checkUserIntent(state) {
  // If user typed 'exit' (case-insensitive), route to END. Otherwise, translate.
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

  // Add conditional routing after getting input
  .addConditionalEdges('getInput', checkUserIntent, {
    continue: 'translateText',
    end: END,
  })

  // After translating, loop back to the input node
  .addEdge('translateText', 'getInput');

// 6. Compile and run the workflow
const graph = workflow.compile();

// Start the graph execution loop
await graph.invoke({
  sourceLang: 'English',
  targetLang: 'Spanish',
});
