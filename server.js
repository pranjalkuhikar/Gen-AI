import chat from "./src/chat/chat.js";
import inputChat from "./src/chat/inputChat.js";
import inputChatLoop from "./src/chat/inputChatLoop.js";
import miscellaneous from "./src/chat/miscellaneous.js";
import chatTempMemory from "./src/chat/chatTempMemory.js";
import embedding from "./src/embedding/embedding.js";
import chatTemplate from "./src/chat/chatTemplate.js";
import finalChat from "./src/chat/finalChat.js";
// import pdfRags from "./src/rag/index.js";
import { loadPDF, loadBrowser } from "./src/rags/practice.js";
import pdfRag from "./src/rags/rag.js";

// 1] chat

// Use this for the most basic single-response test.
// chat();

// Use this when you want one manual question and one model reply.
// inputChat();

// Use this when you want a simple back-and-forth terminal chat loop.
// inputChatLoop();

// Use this when you want a bot personality plus custom generation settings.
// miscellaneous();

// Active runner: terminal chat with temporary memory for the current session.
// chatTempMemory();

// chatTemplate();

// finalChat();

// 2] embedding
// embedding();

// 3] rag
// pdfRags();

// loadPDF("./src/data/Pranjal_Kuhikar_Resume.pdf");
// loadBrowser(
//   "https://www.apple.com/in/macbook-pro/?afid=p240%7Cgo~cmp-11116556120~adg-109516736379~ad-799103666860_kwd-10778630~dev-c~ext-336755558170~prd-~mca-~nt-search&cid=aos-in-kwgo-txt-brand-brand--",
// );

pdfRag("./src/data/Pranjal_Kuhikar_Resume.pdf");
