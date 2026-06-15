import { ChatOpenAI } from '@langchain/openai';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { loadSummarizationChain } from '@langchain/classic/chains';

// ==========================================
// 1. CONFIGURATION & INITIALIZATION
// ==========================================

const model = new ChatOpenAI({
  configuration: {
    baseURL: 'http://localhost:11434/v1',
  },
  apiKey: 'ollama',
  model: 'llama3.2:1b',
  temperature: 0.7,
});

const filePath = './openwindow.pdf';

// ==========================================
// 2. DOCUMENT PROCESSING PIPELINE
// ==========================================

const loader = new PDFLoader(filePath);
const rawDocs = await loader.load();

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const splitDocs = await textSplitter.splitDocuments(rawDocs);

// ==========================================
// 3. EXECUTION
// ==========================================

async function main() {
  console.log(`Loaded PDF. Split into ${splitDocs.length} chunks.`);
  console.log('Generating summary...');

  const chain = loadSummarizationChain(model, { type: 'stuff' });

  const response = await chain.invoke({
    input_documents: splitDocs,
  });

  console.log('\nSummary Result:');
  console.log(response.text);
}

main().catch(console.error);
