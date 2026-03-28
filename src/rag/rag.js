import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenerativeAI } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import config from "../config/config.js";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: config.GEMINI_API_KEY,
});

const client = new GoogleGenerativeAI({
  apiKey: config.GEMINI_API_KEY,
});

const pinecone = new Pinecone({
  apiKey: config.PINECONE_API_KEY,
});

const index = pinecone.Index(config.PINECONE_INDEX);

// 👉 Store docs
export const storeDocs = async (docs) => {
  const vectors = await Promise.all(
    docs.map(async (doc, i) => ({
      id: `doc-${i}-${Date.now()}`,
      values: await embeddings.embedQuery(doc.pageContent),
      metadata: {
        text: doc.pageContent,
      },
    })),
  );

  await index.upsert(vectors);
  console.log("✅ Stored in Pinecone");
};

// 👉 Ask question
export const askQuestion = async (question) => {
  const queryEmbedding = await embeddings.embedQuery(question);

  const result = await index.query({
    vector: queryEmbedding,
    topK: 5,
    includeMetadata: true,
  });

  const context = result.matches.map((m) => m.metadata.text).join("\n");

  const response = await client.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content: "Answer only from context. If not found, say 'Not in notes'.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${question}`,
      },
    ],
  });

  return response.choices[0].message.content;
};
