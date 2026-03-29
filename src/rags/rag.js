import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import promptSync from "prompt-sync";
import config from "../config/config.js";

// ===== MODEL =====
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: config.GEMINI_API_KEY,
});

// ===== EMBEDDINGS =====
const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text", // 👉 768 dimension
});

// ===== PINECONE =====
const pinecone = new Pinecone({
  apiKey: config.PINECONE_API_KEY,
});

const index = pinecone.Index(config.PINECONE_INDEX);

// ===== INPUT =====
const prompt = promptSync();

// ===== PROMPT =====
function template() {
  return ChatPromptTemplate.fromMessages([
    ["system", "You are an expert PDF analyzer."],
    ["human", "Answer the question based on this context:\n{pdfText}"],
  ]);
}

// ===== LOAD + STORE (ONLY FIRST TIME) =====
async function setup(filePath) {
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });
  const chunks = await textSplitter.splitDocuments(docs);
  await PineconeStore.fromDocuments(chunks, embeddings, {
    pineconeIndex: index,
  });
  console.log("Data stored once ✅");
}

// ===== LOAD EXISTING VECTOR DB =====
async function getVectorStore() {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });
  return vectorStore;
}

async function pdfRag(filePath) {
  await setup(filePath);
  const vectorStore = await getVectorStore();
  const chain = template().pipe(model);

  while (true) {
    const input = prompt("You :- ");
    if (input === "exit") break;

    const results = await vectorStore.similaritySearch(input, 3);
    const context = results.map((result) => result.pageContent).join("\n");

    const response = await chain.invoke({
      pdfText: context,
    });
    console.log("Bot :- ", response.content);
  }
}

export { setup, pdfRag };
