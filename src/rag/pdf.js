// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { PDFParse } from "pdf-parse";
// import fs from "node:fs";
// import path from "node:path";
// import { fileURLToPath } from "node:url";

// const currentFilePath = fileURLToPath(import.meta.url);
// const currentDirPath = path.dirname(currentFilePath);

// const loadPDF = async (filePath) => {
//   const resolvedPath = path.isAbsolute(filePath)
//     ? filePath
//     : path.resolve(currentDirPath, filePath);

//   if (!fs.existsSync(resolvedPath)) {
//     throw new Error(`PDF file not found: ${resolvedPath}`);
//   }

//   const dataBuffer = fs.readFileSync(resolvedPath);
//   const parser = new PDFParse({ data: dataBuffer });

//   try {
//     const data = await parser.getText();

//     const splitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 500,
//       chunkOverlap: 100,
//     });

//     const docs = await splitter.createDocuments([data.text]);

//     return docs;
//   } finally {
//     await parser.destroy();
//   }
// };

// export default loadPDF;
