import Logo from "./Logo";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import styles from "./Header.module.css";
import { useAuth } from "../../context/context";
import NavigationLink from "./NavigationLink";

const Header = () => {
	const auth = useAuth();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	let links;

	if (auth?.isLoggedIn) {
		links = (
			<>
				
				<NavigationLink to='/' text='Logout' onClick={auth.logout} />
			</>
		);
	} else {
		links = (
			<>
				<NavigationLink to='/login' text='Sign In'></NavigationLink>
				<NavigationLink to='/signup' text='Create Account'></NavigationLink>
			</>
		);
	}

	return (
		<header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
			<div className={styles.container}>
				{/* Logo Section */}
				<motion.div 
					className={styles.logoSection}
					whileHover={{ scale: 1.05 }}
					transition={{ duration: 0.2 }}
				>
					<Logo />
				</motion.div>

				{/* Desktop Navigation */}
				<nav className={styles.desktopNav}>
					<div className={styles.navLinks}>
						{links}
					</div>
				</nav>

				{/* Mobile Menu Button */}
				<button 
					className={styles.mobileMenuButton}
					onClick={toggleMobileMenu}
					aria-label="Toggle mobile menu"
				>
					<span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.active : ''}`}></span>
				</button>
			</div>

			{/* Mobile Menu */}
			<motion.div 
				className={styles.mobileMenu}
				initial={{ opacity: 0, height: 0 }}
				animate={{ 
					opacity: isMobileMenuOpen ? 1 : 0, 
					height: isMobileMenuOpen ? 'auto' : 0 
				}}
				transition={{ duration: 0.3, ease: "easeInOut" }}
			>
				<div className={styles.mobileNavLinks}>
					{links}
				</div>
			</motion.div>
		</header>
	);
};

export default Header;
