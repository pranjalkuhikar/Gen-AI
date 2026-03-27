import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import promptSync from "prompt-sync";
import config from "../config/config.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: config.GEMINI_API_KEY,
});

const prompt = promptSync();

// ✅ schema define
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    title: z.string(),
    genre: z.string(),
    main_characters: z.array(z.string()),
    plot_summary: z.string(),
    themes: z.array(z.string()),
    message: z.string(),
  }),
);

async function main() {
  const input = prompt("You :- ");

  const formatInstructions = parser.getFormatInstructions();

  const template = ChatPromptTemplate.fromMessages([
    ["system", "You are an expert movie analyzer."],
    [
      "human",
      `Analyze this movie description:
{movieText}
{formatInstructions}`,
    ],
  ]);

  // 🔥 chain
  const chain = template.pipe(model).pipe(parser);

  try {
    const response = await chain.invoke({
      movieText: input,
      formatInstructions,
    });

    console.log("Bot :- ", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Bot :- Failed to analyze the movie description.");
    console.error(error.message);
  }
}

export default main;
