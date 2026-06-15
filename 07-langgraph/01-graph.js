import { StateGraph, START, END, Annotation } from '@langchain/langgraph';

const GraphState = Annotation.Root({
  text: Annotation(),
});

function uppercaseNode(state) {
  return { text: state.text.toUpperCase() };
}

const workflow = new StateGraph(GraphState)

  .addNode('transformer', uppercaseNode)

  .addEdge(START, 'transformer')
  .addEdge('transformer', END);

const graph = workflow.compile();
const result = await graph.invoke({ text: 'hello langgraph js' });

console.log(result);
