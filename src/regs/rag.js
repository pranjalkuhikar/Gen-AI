import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

async function loadPDF(filePath) {
  const loader = new PDFLoader(filePath);

  const docs = await loader.load();

  console.log(docs.length);
}

async function loadBrowser(url) {
  const loader = new CheerioWebBaseLoader(url);
  const docs = await loader.load();
  console.log(docs[0].pageContent);
}

export { loadPDF, loadBrowser };
