import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import promptSync from "prompt-sync";
import config from "../config/config.js";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: config.GEMINI_API_KEY,
});

const prompt = promptSync();

async function loadPDF(filePath) {
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();
  return docs;
}

function template() {
  return ChatPromptTemplate.fromMessages([
    ["system", `You are an expert PDF analyzer. Only return valid JSON.`],
    ["human", `Analyze this PDF description:{pdfText}`],
  ]);
}

async function main(filePath) {
  //   while (true) {
  //     const input = prompt("You :- ");
  //     if (input === "exit") {
  //       break;
  //     }
  const docs = await loadPDF(filePath);
  const chain = template().pipe(model);
  const response = await chain.invoke({
    pdfText: docs.map((doc) => doc.pageContent).join("\n"),
  });
  console.log("Bot :- ", response.content);
  //   }
}

export default main;
