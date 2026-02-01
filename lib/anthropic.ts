import Anthropic from "@anthropic-ai/sdk";

// Support any API key format (sk-ant-, ysk-, etc.)
const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

if (!apiKey) {
  throw new Error("ANTHROPIC_API_KEY environment variable is not set");
}

export const anthropic = new Anthropic({
  apiKey: apiKey,
});
