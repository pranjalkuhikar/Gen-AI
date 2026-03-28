import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

async function loader(filePath) {
  const loader = new PDFLoader(filePath);

  const docs = await loader.load();

  console.log(docs);
}

export default loader;
