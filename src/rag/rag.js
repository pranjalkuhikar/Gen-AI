import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import config from "../config/config.js";

// ✅ Embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: config.GEMINI_API_KEY,
});

// ✅ Gemini LLM
const client = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: config.GEMINI_API_KEY,
});

// ✅ Pinecone
const pinecone = new Pinecone({
  apiKey: config.PINECONE_API_KEY,
});

const index = pinecone.Index(config.PINECONE_INDEX);

// 👉 Store documents
const storeDocs = async (docs) => {
  const contents = docs.map((doc) => doc.pageContent);
  const embeddedDocs = await embeddings.embedDocuments(contents);

  const vectors = embeddedDocs.map((values, i) => ({
    id: `doc-${i}-${Date.now()}`,
    values,
    metadata: {
      text: docs[i].pageContent,
    },
  }));

  await index.upsert(vectors);
  console.log("✅ Stored in Pinecone");
};

// 👉 Ask question
const askQuestion = async (question) => {
  // 1. Query embedding
  const queryEmbedding = await embeddings.embedQuery(question);

  // 2. Search
  const result = await index.query({
    vector: queryEmbedding,
    topK: 5,
    includeMetadata: true,
  });

  // 3. Build context
  const context = result.matches.map((m) => m.metadata.text).join("\n");

  // 4. Gemini answer through LangChain
  const response = await client.invoke(
    `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer only from context. If not found, say 'Not in notes'.`,
  );

  if (typeof response.content === "string") {
    return response.content;
  }

  return response.content
    .map((part) => {
      if (typeof part === "string") {
        return part;
      }

      if (
        part &&
        typeof part === "object" &&
        "text" in part &&
        typeof part.text === "string"
      ) {
        return part.text;
      }

      return "";
    })
    .join("");
};

export { askQuestion, storeDocs };
