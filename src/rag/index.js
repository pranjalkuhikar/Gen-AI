// import loadPDF from "./pdf.js";
// import promptSync from "prompt-sync";
// import { storeDocs, askQuestion } from "./rag.js";

// async function main() {
//   const prompt = promptSync();
//   const docs = await loadPDF("../data/Pranjal_Kuhikar_Resume.pdf");
//   await storeDocs(docs);
//   while (true) {
//     const input = prompt("You :- ");
//     if (input === "exit") {
//       break;
//     }
//     const response = await askQuestion(input);
//     console.log("Bot :- ", response);
//   }
// }

// export default main;
