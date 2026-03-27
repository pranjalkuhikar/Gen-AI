import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import promptSync from "prompt-sync";
import config from "../config/config.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: config.GEMINI_API_KEY,
});

const prompt = promptSync();

async function main() {
  const input = prompt("You :- ");

  const template = ChatPromptTemplate.fromMessages([
    ["system", `You are an expert movie analyzer. Only return valid JSON.`],
    [
      "human",
      `Analyze this movie description:{movieText}
Return output in this JSON format:
{{
  "title": "",
  "genre": "",
  "main_characters": [],
  "plot_summary": "",
  "themes": [],
  "message": ""
}}`,
    ],
  ]);

  const chain = template.pipe(model);

  const response = await chain.invoke({
    movieText: input,
  });

  console.log("Bot :- ", response.content);
}

export default main;
