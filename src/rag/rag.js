import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import config from "../config/config.js";

// ✅ Embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: config.GEMINI_API_KEY,
});

// ✅ Gemini LLM
const client = new ChatGoogleGenerativeAI({
  apiKey: config.GEMINI_API_KEY,
});

// ✅ Pinecone
const pinecone = new Pinecone({
  apiKey: config.PINECONE_API_KEY,
});

const index = pinecone.Index(config.PINECONE_INDEX);

// 👉 Store documents
const storeDocs = async (docs) => {
  const vectors = await Promise.all(
    docs.map(async (doc, i) => {
      const embedding = await embeddings.embedDocuments([doc.pageContent]);

      return {
        id: `doc-${i}-${Date.now()}`,
        values: embedding[0],
        metadata: {
          text: doc.pageContent,
        },
      };
    }),
  );

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

  // 4. Gemini answer
  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const resultLLM = await model.generateContent(
    `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer only from context. If not found, say 'Not in notes'.`,
  );

  const answer = resultLLM.response.text();

  return answer;
};

export { askQuestion, storeDocs };
