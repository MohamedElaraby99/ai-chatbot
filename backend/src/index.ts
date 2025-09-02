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

// CORS Configuration
const allowedOrigins = [
	"http://localhost:5173", 
	"http://localhost:5174",
	"https://ai.fikra.solutions",
	"https://www.ai.fikra.solutions"
];

// Helper function to check if origin is a development IP
const isDevelopmentIP = (origin: string) => {
	if (!origin) {
		console.log('isDevelopmentIP: No origin provided');
		return false;
	}
	try {
		const url = new URL(origin);
		const hostname = url.hostname;
		const port = url.port;
		
		console.log('isDevelopmentIP check:', { origin, hostname, port });
		
		// Allow common development IP ranges and ports
		const isValidIP = (
			hostname.startsWith('192.168.') ||
			hostname.startsWith('10.') ||
			hostname.startsWith('172.') ||
			hostname === '127.0.0.1' ||
			hostname === 'localhost'
		);
		
		const isValidPort = (port === '5173' || port === '5174' || port === '');
		
		console.log('isDevelopmentIP result:', { isValidIP, isValidPort, result: isValidIP && isValidPort });
		
		return isValidIP && isValidPort;
	} catch (error) {
		console.log('isDevelopmentIP error:', error.message);
		return false;
	}
};

app.use(cors({
	origin: function (origin, callback) {
		console.log('CORS origin check:', origin);
		
		// Allow requests with no origin (mobile apps, curl, etc.)
		if (!origin) {
			console.log('No origin - allowing request');
			return callback(null, true);
		}
		
		// Check if origin is in allowed list
		if (allowedOrigins.indexOf(origin) !== -1) {
			console.log('Origin found in allowed list - allowing');
			return callback(null, true);
		}
		
		// Check if origin is a development IP
		if (isDevelopmentIP(origin)) {
			console.log('Origin is development IP - allowing');
			return callback(null, true);
		}
		
		console.log('Origin not allowed:', origin);
		return callback(new Error('Not allowed by CORS'), false);
	},
	credentials: true,
	optionsSuccessStatus: 200, // Support legacy browsers
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
// Middlewares
app.use(express.json({ limit: '10mb' })); // Add size limit for security
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Morgan logging - use 'combined' for production
if (process.env.NODE_ENV === 'production') {
	app.use(morgan('combined'));
} else {
	app.use(morgan('dev'));
}

// Security headers for production
if (process.env.NODE_ENV === 'production') {
	app.use((req, res, next) => {
		res.header('X-Content-Type-Options', 'nosniff');
		res.header('X-Frame-Options', 'DENY');
		res.header('X-XSS-Protection', '1; mode=block');
		res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
		next();
	});
}

// routes
app.use("/api/user/", userRoutes);
app.use("/api/chat/", chatRoutes);
app.use("/api/", demoRoutes);

// Connections and Listeners
mongoose
	.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai")
	.then(() => {
		const port = Number(process.env.PORT) || 5001;
		const host = process.env.HOST || '0.0.0.0'; // Bind to all interfaces
		
		app.listen(port, host, () => {
			console.log(`Server started on http://${host}:${port}`);
			console.log(`MongoDB connected to ${process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai"}`);
			console.log(`Server accessible via local network at http://192.168.1.28:${port}`);
		});
	})
	.catch((err) => {
		console.log("MongoDB connection error:", err.message);
		console.log("Make sure MongoDB is running locally on port 27017");
		// Start server anyway for development
		const port = Number(process.env.PORT) || 5001;
		const host = process.env.HOST || '0.0.0.0';
		
		app.listen(port, host, () => {
			console.log(`Server started on http://${host}:${port} without database connection`);
			console.log(`Server accessible via local network at http://192.168.1.28:${port}`);
		});
	});
