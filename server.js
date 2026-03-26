// Runs one simple model call with a hardcoded "hello" input.
import chat from "./src/chat/chat.js";

// Takes one user prompt from the terminal and sends it to the model once.
import inputChat from "./src/chat/inputChat.js";

// Keeps asking for user input in a loop until you type "exit".
import inputChatLoop from "./src/chat/inputChatLoop.js";

// Adds a system instruction and model settings like temperature/topP.
import miscellaneous from "./src/chat/miscellaneous.js";

// Stores chat history so the model remembers earlier messages in the session.
import chatTempMemory from "./src/chat/chatTempMemory.js";

// Use this for the most basic single-response test.
// chat();

// Use this when you want one manual question and one model reply.
// inputChat();

// Use this when you want a simple back-and-forth terminal chat loop.
// inputChatLoop();

// Use this when you want a bot personality plus custom generation settings.
// miscellaneous();

// Active runner: terminal chat with temporary memory for the current session.
chatTempMemory();
