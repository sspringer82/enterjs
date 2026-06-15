export async function executeToolCalls(toolCalls, messages, tools) {
  for (const call of toolCalls) {
    const fn = tools[call.function.name];
    if (!fn) {
      console.warn(
        `Tool ${call.function.name} was called by the model, but is not defined.`,
      );
      continue;
    }

    try {
      const args = JSON.parse(call.function.arguments);
      console.log(`Executing [${call.function.name}] with args:`, args);

      const result = await fn(args);

      messages.push({
        role: 'tool',
        tool_call_id: call.id,
        content: String(result),
      });
    } catch (error) {
      console.error(`Error executing tool [${call.function.name}]:`, error);
    }
  }
}
