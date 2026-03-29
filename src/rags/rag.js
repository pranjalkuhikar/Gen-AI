import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CohereEmbeddings } from "@langchain/cohere";
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
const embeddings = new CohereEmbeddings({
  apiKey: config.COHERE_API_KEY,
  model: "embed-english-v3.0",
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
  const nonEmptyDocs = docs.filter((doc) => doc.pageContent?.trim());

  if (nonEmptyDocs.length === 0) {
    throw new Error(`No text could be extracted from PDF: ${filePath}`);
  }

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });
  const chunks = (await textSplitter.splitDocuments(nonEmptyDocs)).filter(
    (chunk) => chunk.pageContent?.trim(),
  );

  if (chunks.length === 0) {
    throw new Error(`PDF was loaded, but no non-empty chunks were created: ${filePath}`);
  }

  await PineconeStore.fromDocuments(chunks, embeddings, {
    pineconeIndex: index,
  });
  console.log(`Stored ${chunks.length} chunks in Pinecone ✅`);
}

// ===== LOAD EXISTING VECTOR DB =====
async function getVectorStore() {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });
  return vectorStore;
}

async function pdfRag() {
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
