import Logo from "./Logo";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

	// Close mobile menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;
			const clickedInsideMenu = !!target.closest(`.${styles.mobileMenu}`);
			const clickedMenuButton = !!target.closest(`.${styles.mobileMenuButton}`);
			if (isMobileMenuOpen && !clickedInsideMenu && !clickedMenuButton) {
				setIsMobileMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isMobileMenuOpen]);

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
				<NavigationLink to='/login' text='Sign In' onClick={async () => { setIsMobileMenuOpen(false); }}></NavigationLink>
				<NavigationLink to='/signup' text='Create Account' onClick={async () => { setIsMobileMenuOpen(false); }}></NavigationLink>
			</>
		);
	}

	return (
		<motion.header 
			className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
			initial={{ y: -100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<div className={styles.container}>
				{/* Logo Section */}
				<Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
					<motion.div 
						className={styles.logoSection}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
					>
						<Logo />
					</motion.div>
				</Link>

				{/* Desktop Navigation */}
				<motion.nav 
					className={styles.desktopNav}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
				>
					<div className={styles.navLinks}>
						{links}
					</div>
				</motion.nav>

				{/* Mobile Menu Button */}
				<motion.button 
					className={styles.mobileMenuButton}
					onClick={toggleMobileMenu}
					aria-label="Toggle mobile menu"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					transition={{ duration: 0.2, ease: "easeInOut" }}
				>
					<span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.active : ''}`}></span>
				</motion.button>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div 
						className={styles.mobileMenu}
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ 
							duration: 0.4, 
							ease: "easeInOut",
							height: { duration: 0.3 }
						}}
					>
						<motion.div 
							className={styles.mobileNavLinks}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.1 }}
						>
							{links}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
};

export default Header;
