import { Request, Response, NextFunction } from "express";
import User from "../models/user-model.js";
import { configureGoogleAI, getDefaultModel } from "../configs/open-ai-config.js";

export const generateChatCompletion = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { message } = req.body;

		const user = await User.findById(res.locals.jwtData.id);
		if (!user) {
			return res.status(401).json("User not registered / token malfunctioned");
		}

		// grab chats of users
		const chats = user.chats.map(({ role, content }) => ({
			role,
			content,
		}));
		chats.push({ content: message, role: "user" });

		// save chats inside real user object
		user.chats.push({ content: message, role: "user" });

		// Debug: Log the API key being used (masked for security)
		const apiKey = process.env.GOOGLE_GENAI_API_KEY;
		console.log("Using Google GenAI API key:", apiKey ? `${apiKey.substring(0, 10)}...` : "NOT SET");
		console.log("Using model:", getDefaultModel());

		// Configure Google GenAI
		const ai = configureGoogleAI();
		const model = ai.models.generateContent;

		// Convert chat format for Gemini (Gemini uses different format than OpenAI)
		const geminiContents = chats.map(chat => ({
			role: chat.role === "user" ? "user" : "model",
			parts: [{ text: chat.content }]
		}));

		// Generate content using Gemini
		const result = await model({
			model: getDefaultModel(),
			contents: geminiContents,
		});

		// Extract the text from the result
		const assistantMessage = {
			role: "assistant",
			content: result.text
		};
		
		// push latest response to db
		user.chats.push(assistantMessage);
		await user.save();

		return res.status(200).json({ chats: user.chats });
	} catch (error) {
		console.log("Google GenAI error:", error);
		return res.status(500).json({ message: error.message });
	}
};

export const getAllChats = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware
        
		if (!user)
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});

		if (user._id.toString() !== res.locals.jwtData.id) {
			return res
				.status(401)
				.json({ message: "ERROR", cause: "Permissions didn't match" });
		}
		return res.status(200).json({ message: "OK", chats: user.chats });
	} catch (err) {
		console.log(err);
		return res.status(200).json({ message: "ERROR", cause: err.message });
	}
};

export const deleteAllChats = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware
        
		if (!user)
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});

		if (user._id.toString() !== res.locals.jwtData.id) {
			return res
				.status(401)
				.json({ message: "ERROR", cause: "Permissions didn't match" });
		}

        //@ts-ignore
        user.chats = []
        await user.save()
		return res.status(200).json({ message: "OK", chats: user.chats });
	} catch (err) {
		console.log(err);
		return res.status(200).json({ message: "ERROR", cause: err.message });
	}
};