import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import pdf from "pdf-parse";
import fs from "fs";

const loadPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const docs = await splitter.createDocuments([data.text]);

  return docs;
};

export default loadPDF;
