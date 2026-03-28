import loadPDF from "./pdf.js";
import { storeDocs, askQuestion } from "./rag.js";

async function main() {
  const docs = await loadPDF("./data/MERN Stack.pdf");
  await storeDocs(docs);
  while (true) {
    const input = prompt("You :- ");
    if (input === "exit") {
      break;
    }
    const response = await askQuestion(input);
    console.log("Bot :- ", response);
  }
}

export default main;
