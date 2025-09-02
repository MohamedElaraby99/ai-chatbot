import express from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { deleteAllChats, generateChatCompletion, getAllChats } from "../controllers/chat-controllers.js";

const chatRoutes = express.Router();

// test
chatRoutes.get("/", (req, res, next) => {
	console.log("hi");
	res.send("hello from chatRoutes");
});

// Test Google GenAI API key
chatRoutes.get("/test-api", async (req, res) => {
	try {
		const apiKey = process.env.GOOGLE_GENAI_API_KEY;
		if (!apiKey) {
			return res.status(500).json({ error: "No Google GenAI API key found" });
		}

		console.log("Testing Google GenAI API key...");
		
		// Test with a simple request to Google GenAI
		const { GoogleGenAI } = await import("@google/genai");
		const ai = new GoogleGenAI({ apiKey });
		
		try {
			const result = await ai.models.generateContent({
				model: "gemini-2.0-flash",
				contents: "Hello, this is a test message.",
			});
			
			res.json({ 
				status: "success", 
				message: "Google GenAI API key is working",
				testResponse: result.text,
				apiKeyPrefix: apiKey.substring(0, 10) + "..."
			});
		} catch (genaiError) {
			res.status(500).json({ 
				status: "error", 
				message: "Google GenAI test failed", 
				error: genaiError.message 
			});
		}
	} catch (error) {
		console.error("API test error:", error);
		res.status(500).json({ 
			status: "error", 
			message: "API test failed", 
			error: error.message 
		});
	}
});

// protected API

chatRoutes.post(
	"/new",
	validate(chatCompletionValidator),
	verifyToken,
	generateChatCompletion
);

chatRoutes.get(
	"/all-chats",
	verifyToken,
	getAllChats
);

chatRoutes.delete(
    "/delete-all-chats",
    verifyToken,
    deleteAllChats
)

export default chatRoutes;
