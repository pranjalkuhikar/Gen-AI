import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import promptSync from "prompt-sync";
import config from "../config/config.js";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: config.GEMINI_API_KEY,
});

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

const pinecone = new Pinecone({
  apiKey: config.PINECONE_API_KEY,
});

const index = pinecone.Index(config.PINECONE_INDEX);

const prompt = promptSync();

function template() {
  return ChatPromptTemplate.fromMessages([
    ["system", `You are an expert PDF analyzer. Only return valid JSON.`],
    ["human", `Analyze this PDF description:{pdfText}`],
  ]);
}

async function loadPDF(filePath) {
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();
  return docs;
}

async function splitText(docs) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });
  return textSplitter.splitDocuments(docs);
}

async function storeChunks(chunks) {
  const vectorStore = await PineconeStore.fromDocuments(
    chunks,
    documentEmbeddings,
    { pineconeIndex: index },
  );
  return vectorStore;
}

async function main(filePath) {
  //   while (true) {
  //     const input = prompt("You :- ");
  //     if (input === "exit") {
  //       break;
  //     }
  const docs = await loadPDF(filePath);
  const splitDocs = await splitText(docs);
  const vectorStore = await storeChunks(splitDocs);

  const useQuery = "Hello";
  const results = await vectorStore.similaritySearch(useQuery, 3);
  const context = results.map((result) => result.pageContent).join("\n");

  const chain = template().pipe(model);
  const response = await chain.invoke({
    pdfText: context,
  });
  console.log("Bot :- ", response.content);
  //   }
}

export default main;
