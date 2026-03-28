import { loadAndSplitPDF } from "./pdf.js";
import { storeDocs, askQuestion } from "./rag.js";

async function main() {
  const docs = await loadAndSplitPDF("./data/MERN Stack.pdf");
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

return main;
