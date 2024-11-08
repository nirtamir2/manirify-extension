
export async function getAIEmojiFromText(text: string) {
  const session = await window.ai.languageModel.create({
    initialPrompts: [
      {
        role: "system",
        content:
          "Predict up to 5 emojis as a response to a comment. Output emojis, comma-separated.",
      },
      { role: "user", content: "This is amazing!" },
      { role: "assistant", content: "❤️, ➕" },
      { role: "user", content: "LGTM" },
      { role: "assistant", content: "👍, 🚢" },
    ],
  });

  // Clone an existing session for efficiency, instead of recreating one each time.
  async function predictEmoji(comment: string) {
    const freshSession = await session.clone();
    return await freshSession.prompt(comment);
  }

  const result1 = await predictEmoji(text);

  return result1;
}
