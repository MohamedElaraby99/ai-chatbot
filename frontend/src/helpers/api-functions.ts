import axios from "axios";

// Set the base URL based on environment variables or fallback to domain detection
const getApiBaseUrl = () => {
	// Check if environment variable is set (for build-time configuration)
	if (import.meta.env.VITE_API_BASE_URL) {
		console.log('Using environment VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
		return import.meta.env.VITE_API_BASE_URL;
	}
	
	// Fallback to runtime domain detection
	const hostname = window.location.hostname;
	const port = window.location.port;
	const protocol = window.location.protocol;
	
	console.log('Environment detection - hostname:', hostname, 'port:', port, 'protocol:', protocol);
	// Environment info logged for debugging
	
	// Enhanced development detection
	const isDevelopment = 
		// Standard localhost detection
		hostname === 'localhost' || 
		hostname === '127.0.0.1' || 
		// Local network IP ranges
		hostname.startsWith('192.168.') || 
		hostname.startsWith('10.') || 
		hostname.startsWith('172.') ||
		// Development ports
		port === '5173' || 
		port === '5174' ||
		// Vite dev mode
		(import.meta.env?.DEV === true);
	
	console.log('Is development environment:', isDevelopment);
	
	if (isDevelopment) {
		// For development, construct the backend URL using the same hostname but port 5001
		const devUrl = `http://${hostname}:5001/api`;
		console.log('Using development API URL:', devUrl);
		return devUrl;
	} else {
		const prodUrl = "https://api.ai.fikra.solutions/api";
		console.log('Using production API URL:', prodUrl);
		return prodUrl;
	}
};

axios.defaults.baseURL = getApiBaseUrl();
axios.defaults.withCredentials = true;

// Debug logging for development
console.log('=== API Configuration Debug ===');
console.log('Final API Base URL:', axios.defaults.baseURL);
console.log('Credentials enabled:', axios.defaults.withCredentials);
console.log('==============================');

export const userLogin = async (email: string, password: string) => {
	try {
		const response = await axios.post("/user/login", { email, password });
		if (response.status !== 200) {
			throw new Error();
		}
		const data = await response.data;
		return data;
	} catch (err: any) {
		throw new Error(`Error! Cannot Login. ${err.message}`);
	}
};

export const userSignup = async (
	name: string,
	email: string,
	password: string
) => {
	try {
		const response = await axios.post("/user/signup", {
			name,
			email,
			password,
		});
		const data = await response.data;
		return data;
	} catch (err: any) {
        console.log(err)
		throw new Error(`Error! Cannot Signup. ${err.message}`);
	}
};

export const getAuthStatus = async () => {
	try {
		const response = await axios.get("/user/auth-status");
		if (response.status !== 200) {
			throw new Error("Could not verify authentication status");
		}
		const data = await response.data;
		return data;
	} catch (err: any) {
		throw new Error(err.message);
	}
};

export const postChatRequest = async (message: string) => {
	console.log("hello", message);
	try {
		const response = await axios.post("/chat/new", { message });
		console.log(response);
		if (response.status !== 200) {
			throw new Error();
		}
		const data = await response.data;
		return data;
	} catch (err: any) {
		console.log(err);
		throw new Error(err.message);
	}
};

export const getAllChats = async () => {
	try {
		const response = await axios.get("/chat/all-chats");
		if (response.status !== 200) {
			throw new Error();
		}
		const data = await response.data;
		return data;
	} catch (err: any) {
		console.log(err);
		throw new Error(err.message);
	}
};

export const deleteAllChats = async () => {
	try {
		const response = await axios.delete("/chat/delete-all-chats");
		if (response.status !== 200) {
			throw new Error();
		}
		const data = await response.data;
		return data;
	} catch (err: any) {
		console.log(err);
		throw new Error(err.message);
	}
};

export const submitDemoRequest = async (formData: {
	name: string;
	email: string;
	company: string;
	useCase: string;
	message: string;
}) => {
	try {
		console.log('Submitting demo request to:', axios.defaults.baseURL + '/demo-request');
		console.log('Form data:', formData);
		
		const response = await axios.post("/demo-request", formData);
		if (response.status !== 200) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		const data = await response.data;
		console.log('Demo request successful:', data);
		return data;
	} catch (err: any) {
		console.error('Demo request error details:', {
			message: err.message,
			code: err.code,
			response: err.response?.data,
			status: err.response?.status,
			url: err.config?.url,
			baseURL: err.config?.baseURL
		});
		throw new Error(`Demo request failed: ${err.message}`);
	}
};

export const logoutUser = async () => {
	try {
		const response = await axios.get("/user/logout");
		if (response.status !== 200) {
			throw new Error();
		}
		const data = await response.data;
		return data;
	} catch (err: any) {
		console.log(err);
		throw new Error(err.message);
	}
};
