import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import config from "../config/config.js";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: config.GEMINI_API_KEY,
});

async function main() {
  const response = await model.invoke("hello");
  console.log(response.content);
}

export default main;
