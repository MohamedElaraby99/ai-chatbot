import Header from "./components/shared/Header";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Demo from "./pages/Demo";
import { useAuth } from "./context/context";

import styles from "./App.module.css";

function App() {
	let routes;
	if (useAuth()?.isLoggedIn) {
		routes = (
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/chat' element={<Chat />} />
				<Route path='/demo' element={<Demo />} />
			</Routes>
		);
	} else {
		routes = (
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<Signup />} />
				<Route path='/demo' element={<Demo />} />
			</Routes>
		);
	}

	return (
		<div>
			<Header />
			<main className={styles.routes}>
                {routes}
            </main>
		</div>
	);
}

export default App;
