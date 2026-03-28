import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
const envFilePath = path.resolve(currentDirPath, "../../.env");

dotenv.config({ path: envFilePath });

const _config = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY?.trim(),
  PINECONE_API_KEY: process.env.PINECONE_API_KEY?.trim(),
  PINECONE_INDEX: process.env.PINECONE_INDEX?.trim(),
};

if (!_config.GEMINI_API_KEY) {
  throw new Error(`Missing GEMINI_API_KEY in ${envFilePath}`);
}

const config = Object.freeze(_config);

export default config;
