import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
} from "@langchain/core/messages";
import promptSync from "prompt-sync";
import config from "../config/config.js";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: config.GEMINI_API_KEY,
});

// 1. Initialize with System Instruction inside the history array
const chatHistory = [new SystemMessage("You are a funny bot")];

// Input
const prompt = promptSync();

async function main() {
  while (true) {
    const input = prompt("You :- ");
    if (input.toLowerCase() === "exit") break;

    // 2. Add User message to the history
    chatHistory.push(new HumanMessage(input));

    // 3. Send the WHOLE ARRAY to the model
    const response = await model.invoke(chatHistory);

    // 4. Add the AI's response to history so it remembers what it said!
    chatHistory.push(new AIMessage(response.content));

    console.log("Bot :- ", response.content);
  }
}

export default main;
