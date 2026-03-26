import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import config from "../config/config.js";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: config.GEMINI_API_KEY,
});

async function main() {
  try {
    const vector1 = await embeddings.embedQuery("Hello");
    const vector2 = await embeddings.embedDocuments(["Hello", "World"]);

    console.log(vector1);
    console.log(vector2);
  } catch (error) {
    console.error("Embedding request failed:", error);
  }
}

export default main;
