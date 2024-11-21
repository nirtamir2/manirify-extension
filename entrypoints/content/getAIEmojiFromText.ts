export async function getAIEmojiFromText(text: string): Promise<string> {
  const systemPrompt = `You are an expert emoji translator. Convert any user-provided text into a sequence of relevant emojis. For example, if the user inputs "hello world," respond with "👋🌍." Always reply with the emoji translation only, without any additional text or explanation`;

  const session = await globalThis.ai.languageModel.create({
    systemPrompt,
  });

  const result = await session.prompt(text);

  return result;
}
