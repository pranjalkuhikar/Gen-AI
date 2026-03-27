import chat from "./src/chat/chat.js";
import inputChat from "./src/chat/inputChat.js";
import inputChatLoop from "./src/chat/inputChatLoop.js";
import miscellaneous from "./src/chat/miscellaneous.js";
import chatTempMemory from "./src/chat/chatTempMemory.js";
import embedding from "./src/embedding/embedding.js";
import chatTemplate from "./src/chat/chatTemplate.js";

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

chatTemplate();

// 2] embedding
// embedding();
