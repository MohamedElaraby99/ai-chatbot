import {
	userLogin,
	getAuthStatus,
	logoutUser,
	userSignup,
} from "../../helpers/api-functions";
import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

type User = {
	name: string;
	email: string;
};

type Language = "en" | "ar";

type UserAuth = {
	user: User | null;
	isLoggedIn: boolean;
	language: Language;
	languageDirection: "ltr" | "rtl";
	login: (email: string, password: string) => Promise<void>;
	signup: (name: string, email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	setLanguage: (lang: Language) => void;
};

const AuthContext = createContext<UserAuth | null>(null);

// react component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoggedIn, setisLoggedIn] = useState(false);
	const [language, setLanguageState] = useState<Language>("en");

	// Get language direction based on selected language
	const languageDirection = language === "ar" ? "rtl" : "ltr";

	// Update document direction when language changes
	useEffect(() => {
		document.documentElement.dir = languageDirection;
		document.documentElement.lang = language;
	}, [language, languageDirection]);

	// check if user cookies are valid and then skip login
	useEffect(() => {
		const checkAuthStatus = async () => {
			const data = await getAuthStatus();
			if (data) {
				setUser({ email: data.email, name: data.name });
				setisLoggedIn(true);
			}
		};
		checkAuthStatus();
	}, []);

	// Load saved language preference
	useEffect(() => {
		const savedLanguage = localStorage.getItem("chat-language") as Language;
		if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
			setLanguageState(savedLanguage);
		}
	}, []);

	const setLanguage = (lang: Language) => {
		setLanguageState(lang);
		localStorage.setItem("chat-language", lang);
	};

	const login = async (email: string, password: string) => {
		const data = await userLogin(email, password);
		if (data) {
			setUser({ email: data.email, name: data.name });
			setisLoggedIn(true);
		}
	};

	const signup = async (name: string, email: string, password: string) => {
		await userSignup(name, email, password);
	};

	const logout = async () => {
		await logoutUser();
		setisLoggedIn(false);
		setUser(null);
		window.location.reload(); // reload webpage
	};

	const value = {
		user,
		isLoggedIn,
		language,
		languageDirection,
		login,
		logout,
		signup,
		setLanguage,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// create variable context that should be used by the childrens

export const useAuth = () => useContext(AuthContext);
