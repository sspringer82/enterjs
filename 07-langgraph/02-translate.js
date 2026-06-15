import { StateGraph, START, END, Annotation } from '@langchain/langgraph';
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
    `\n--- Ready to translate from ${state.sourceLang} to ${state.targetLang} ---`,
  );
  const answer = await rl.question('Enter text to translate: ');
  rl.close();

  // Return updates to the state
  return { userInput: answer };
}

// Node B: Send data to Ollama for translation
async function translationNode(state) {
  console.log('Translating...');

  const prompt = `You are a professional translator. Translate the following text from ${state.sourceLang} to ${state.targetLang}. 
Do not provide any conversational text or explanation. Only return the exact translation.

Text: "${state.userInput}"`;

  const response = await llm.invoke(prompt);

  return { translation: response.content };
}

// 4. Construct the Graph Workflow
const workflow = new StateGraph(GraphState)
  .addNode('getInput', inputNode)
  .addNode('translateText', translationNode)

  // Define execution order
  .addEdge(START, 'getInput')
  .addEdge('getInput', 'translateText')
  .addEdge('translateText', END);

// 5. Compile and run the workflow
const graph = workflow.compile();

// Initialize the state with configurations and execute
const finalState = await graph.invoke({
  sourceLang: 'English',
  targetLang: 'Spanish',
});

// Output the final accumulated result
console.log('\n================ RESULT ================');
console.log(`Original:    ${finalState.userInput}`);
console.log(`Translation: ${finalState.translation}`);
console.log('========================================\n');
