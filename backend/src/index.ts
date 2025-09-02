import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user-routes.js";
import chatRoutes from "./routes/chat-routes.js";
import demoRoutes from "./routes/demo-routes.js";

import { config } from "dotenv";

config();

const app = express();

// Middlewares

app.use(cors({origin:["http://localhost:5173", "http://localhost:5174"], credentials: true}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(morgan("dev")); // for development

// routes
app.use("/api/user/", userRoutes);
app.use("/api/chat/", chatRoutes);
app.use("/api/", demoRoutes);

// Connections and Listeners
mongoose
	.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai")
	.then(() => {
		app.listen(process.env.PORT || 5001);
		console.log(
			`Server started on port ${
				process.env.PORT || 5001
			} and MongoDB is connected to ${process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai"}`
		);
	})
	.catch((err) => {
		console.log("MongoDB connection error:", err.message);
		console.log("Make sure MongoDB is running locally on port 27017");
		// Start server anyway for development
		app.listen(process.env.PORT || 5001);
		console.log(
			`Server started on port ${process.env.PORT || 5001} without database connection`
		);
	});
