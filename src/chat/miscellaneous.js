import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import promptSync from "prompt-sync";
import config from "../config/config.js";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: config.GEMINI_API_KEY,
  temperature: 0.7, // Randomness (0.0 to 2.0)
  topP: 0.9, // Word pool diversity (0.0 to 1.0)
  maxOutputTokens: 500, // Max length of the response
});

// Define the personality ONCE
const SystemInstruction = new SystemMessage("You are a funny bot");
// Input
const prompt = promptSync();

async function main() {
  while (true) {
    const input = prompt("You :- ");
    if (input.toLowerCase() === "exit") break;
    // HumanMessage
    const response = await model.invoke([
      SystemInstruction,
      new HumanMessage(input),
    ]);
    console.log("Bot :- ", response.content);
  }
}

export default main;
