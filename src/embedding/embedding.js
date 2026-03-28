import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import config from "../config/config.js";

const queryEmbeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  taskType: "RETRIEVAL_QUERY",
  apiKey: config.GEMINI_API_KEY,
});

const documentEmbeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  taskType: "RETRIEVAL_DOCUMENT",
  apiKey: config.GEMINI_API_KEY,
});

async function main() {
  try {
    const vector1 = await queryEmbeddings.embedQuery("Hello");
    const vector2 = await Promise.all([
      documentEmbeddings.embedQuery("Hello"),
      documentEmbeddings.embedQuery("World"),
    ]);

    console.log(vector1);
    console.log(vector2);
  } catch (error) {
    console.error("Embedding request failed:", error);
  }
}

export default main;
