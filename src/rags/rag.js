import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import promptSync from "prompt-sync";
import config from "../config/config.js";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: config.GEMINI_API_KEY,
});

const prompt = promptSync();

async function main() {
  while (true) {
    const input = prompt("You :- ");
    if (input === "exit") {
      break;
    }
    const response = await model.invoke(input);
    console.log("Bot :- ", response.content);
  }
}

export default main;
