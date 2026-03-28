// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { Pinecone } from "@pinecone-database/pinecone";
// import config from "../config/config.js";

// // ✅ Embeddings
// const documentEmbeddings = new GoogleGenerativeAIEmbeddings({
//   model: "gemini-embedding-001",
//   taskType: "RETRIEVAL_DOCUMENT",
//   apiKey: config.GEMINI_API_KEY,
// });

// const queryEmbeddings = new GoogleGenerativeAIEmbeddings({
//   model: "gemini-embedding-001",
//   taskType: "RETRIEVAL_QUERY",
//   apiKey: config.GEMINI_API_KEY,
// });

// // ✅ Gemini LLM
// const client = new ChatGoogleGenerativeAI({
//   model: "gemini-2.5-flash",
//   apiKey: config.GEMINI_API_KEY,
// });

// // ✅ Pinecone
// const pinecone = new Pinecone({
//   apiKey: config.PINECONE_API_KEY,
// });

// const index = pinecone.Index(config.PINECONE_INDEX);
// const UPSERT_BATCH_SIZE = 100;
// const EMBEDDING_CONCURRENCY = 10;
// let indexDimensionPromise;
// let hasLoggedDimensionTrim = false;

// const getIndexDimension = async () => {
//   if (!indexDimensionPromise) {
//     indexDimensionPromise = pinecone
//       .describeIndex(config.PINECONE_INDEX)
//       .then((indexDescription) => {
//         if (typeof indexDescription.dimension !== "number") {
//           throw new Error(
//             `Could not determine dimension for Pinecone index "${config.PINECONE_INDEX}".`,
//           );
//         }

//         return indexDescription.dimension;
//       });
//   }

//   return indexDimensionPromise;
// };

// const normalizeVector = (vector) => {
//   const magnitude = Math.sqrt(
//     vector.reduce((sum, value) => sum + value * value, 0),
//   );

//   if (magnitude === 0) {
//     return vector;
//   }

//   return vector.map((value) => value / magnitude);
// };

// const fitVectorToDimension = (vector, targetDimension) => {
//   if (!Array.isArray(vector) || vector.length === 0) {
//     throw new Error("Embedding generation returned an empty vector.");
//   }

//   let resizedVector = vector;

//   if (vector.length === targetDimension) {
//     resizedVector = vector;
//   } else if (vector.length < targetDimension) {
//     throw new Error(
//       `Embedding dimension ${vector.length} is smaller than Pinecone index dimension ${targetDimension}.`,
//     );
//   } else {
//     if (!hasLoggedDimensionTrim) {
//       console.warn(
//         `Pinecone index dimension is ${targetDimension}, trimming Gemini embeddings from ${vector.length} to match.`,
//       );
//       hasLoggedDimensionTrim = true;
//     }
//     resizedVector = vector.slice(0, targetDimension);
//   }

//   if (targetDimension !== 3072) {
//     return normalizeVector(resizedVector);
//   }

//   return resizedVector;
// };

// const embedTexts = async (texts, embeddingModel) => {
//   const vectors = [];

//   for (let i = 0; i < texts.length; i += EMBEDDING_CONCURRENCY) {
//     const batch = texts.slice(i, i + EMBEDDING_CONCURRENCY);
//     const batchVectors = await Promise.all(
//       batch.map((text) => embeddingModel.embedQuery(text)),
//     );

//     vectors.push(...batchVectors);
//   }

//   return vectors;
// };

// // 👉 Store documents
// const storeDocs = async (docs) => {
//   const chunks = docs
//     .map((doc, i) => ({
//       id: `doc-${i}`,
//       text: doc.pageContent?.trim() ?? "",
//     }))
//     .filter((chunk) => chunk.text.length > 0);

//   if (chunks.length === 0) {
//     throw new Error("No non-empty document chunks were generated for Pinecone.");
//   }

//   const indexDimension = await getIndexDimension();
//   const embeddedDocs = await embedTexts(
//     chunks.map((chunk) => chunk.text),
//     documentEmbeddings,
//   );

//   const records = embeddedDocs.map((values, i) => ({
//     id: chunks[i].id,
//     values: fitVectorToDimension(values, indexDimension),
//     metadata: {
//       text: chunks[i].text,
//     },
//   }));

//   const emptyEmbeddingCount = records.filter(
//     (record) => !Array.isArray(record.values) || record.values.length === 0,
//   ).length;

//   if (emptyEmbeddingCount > 0) {
//     throw new Error(
//       `Embedding generation returned ${emptyEmbeddingCount} empty vector(s).`,
//     );
//   }

//   for (let i = 0; i < records.length; i += UPSERT_BATCH_SIZE) {
//     const batch = records.slice(i, i + UPSERT_BATCH_SIZE);
//     await index.upsert({ records: batch });
//   }

//   console.log(`✅ Stored ${records.length} chunks in Pinecone`);
// };

// // 👉 Ask question
// const askQuestion = async (question) => {
//   // 1. Query embedding
//   const indexDimension = await getIndexDimension();
//   const queryEmbedding = fitVectorToDimension(
//     await queryEmbeddings.embedQuery(question),
//     indexDimension,
//   );

//   // 2. Search
//   const result = await index.query({
//     vector: queryEmbedding,
//     topK: 5,
//     includeMetadata: true,
//   });

//   // 3. Build context
//   const context = result.matches.map((m) => m.metadata.text).join("\n");

//   // 4. Gemini answer through LangChain
//   const response = await client.invoke(
//     `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer only from context. If not found, say 'Not in notes'.`,
//   );

//   if (typeof response.content === "string") {
//     return response.content;
//   }

//   return response.content
//     .map((part) => {
//       if (typeof part === "string") {
//         return part;
//       }

//       if (
//         part &&
//         typeof part === "object" &&
//         "text" in part &&
//         typeof part.text === "string"
//       ) {
//         return part.text;
//       }

//       return "";
//     })
//     .join("");
// };

// export { askQuestion, storeDocs };
