import mainBot from "/page-photos/homepage-bot.png";
import ui1 from "/page-photos/UI-1.png";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import Section from "../components/home/Sections";
import styles from "./Home.module.css";

const Home = () => {
	const fadeInUp = {
		initial: { opacity: 0, y: 60 },
		animate: { opacity: 1, y: 0 }
	};

	const staggerContainer = {
		animate: {
			transition: {
				staggerChildren: 0.2
			}
		}
	};

	const cardHover = {
		initial: { opacity: 0, y: 60 },
		animate: { opacity: 1, y: 0 }
	};

	const sectionHover = {
		// No hover effects to avoid transform issues
	};

	const handleFeatureClick = (featureName: string) => {
		console.log(`Feature clicked: ${featureName}`);
		// You can add navigation or modal functionality here
	};

	return (
		<div className={styles.parent}>
			{/* Neural Network Background Elements - Now covers entire page */}
			<div className={styles.neuralParticles}>
				<div className={styles.particle}></div>
				<div className={styles.particle}></div>
				<div className={styles.particle}></div>
				<div className={styles.particle}></div>
				<div className={styles.particle}></div>
				<div className={styles.particle}></div>
			</div>
			<div className={styles.neuralConnections}>
				<div className={styles.connection}></div>
				<div className={styles.connection}></div>
				<div className={styles.connection}></div>
				<div className={styles.connection}></div>
				<div className={styles.connection}></div>
			</div>

			{/* Hero Section */}
			<section className={styles.hero}>
				<div className={styles.heroContent}>
					<motion.div
						variants={staggerContainer}
						initial="initial"
						animate="animate"
						className={styles.heroText}
					>
						<motion.h2 variants={fadeInUp} transition={{ duration: 0.8, ease: "easeOut" }} className={styles.subtitle}>
							 Fikra AI
						</motion.h2>
						<motion.h1 variants={fadeInUp} transition={{ duration: 0.8, ease: "easeOut" }} className={styles.title}>
							Your Own Next-Gen <span className={styles.highlight}>Personal Chatbot</span>
						</motion.h1>
						<motion.p variants={fadeInUp} transition={{ duration: 0.8, ease: "easeOut" }} className={styles.description}>
							 Developed by Fikra Software, Fikra AI is your smart companion for learning, work, and daily life.
						</motion.p>
						<motion.div variants={fadeInUp} transition={{ duration: 0.8, ease: "easeOut" }} className={styles.ctaContainer}>
							<NavLink to='/login' className={styles.primaryBtn}>
								Get Started For Free
							</NavLink>
							<NavLink to='/demo' className={styles.secondaryBtn}>
								Try Demo
							</NavLink>
						</motion.div>
					</motion.div>
					<motion.div
						variants={fadeInUp}
						initial="initial"
						animate="animate"
						transition={{ duration: 0.8, ease: "easeOut" }}
						className={styles.heroImage}
					>
						<img src={mainBot} alt="Fikra AI Chat Bot" />
					</motion.div>
				</div>
			</section>

			{/* Features Section */}
			<motion.section 
				className={styles.features}
				variants={sectionHover}
			>
				<motion.div
					variants={staggerContainer}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className={styles.featuresContainer}
				>
					<motion.h2 variants={fadeInUp} transition={{ duration: 0.8, ease: "easeOut" }} className={styles.featuresTitle}>
						 Why Fikra AI?
					</motion.h2>
					<div className={styles.featuresGrid}>
						<motion.div 
							variants={cardHover}
							transition={{ duration: 0.8, ease: "easeOut" }} 
							className={styles.featureCard}
							onClick={() => handleFeatureClick("Next-Generation Platform")}
							style={{ cursor: 'pointer' }}
						>
							<h3>Next-Generation Platform</h3>
							<p>Cutting-edge AI technology tailored to your needs</p>
						</motion.div>
						<motion.div 
							variants={cardHover}
							transition={{ duration: 0.8, ease: "easeOut" }} 
							className={styles.featureCard}
							onClick={() => handleFeatureClick("Personal Chatbot")}
							style={{ cursor: 'pointer' }}
						>
							<h3>Personal Chatbot</h3>
							<p>Get assistance, insights, and answers instantly</p>
						</motion.div>
						<motion.div 
							variants={cardHover}
							transition={{ duration: 0.8, ease: "easeOut" }} 
							className={styles.featureCard}
							onClick={() => handleFeatureClick("Secure & Confidential")}
							style={{ cursor: 'pointer' }}
						>
							<h3>Secure & Confidential</h3>
							<p>Your conversations stay private and protected</p>
						</motion.div>
						<motion.div 
							variants={cardHover}
							transition={{ duration: 0.8, ease: "easeOut" }} 
							className={styles.featureCard}
							onClick={() => handleFeatureClick("Seamless Experience")}
							style={{ cursor: 'pointer' }}
						>
							<h3>Seamless Experience</h3>
							<p>Natural, user-friendly interface designed for everyone</p>
						</motion.div>
						<motion.div 
							variants={cardHover}
							transition={{ duration: 0.8, ease: "easeOut" }} 
							className={styles.featureCard}
							onClick={() => handleFeatureClick("All-in-One Support")}
							style={{ cursor: 'pointer' }}
						>
							<h3>All-in-One Support</h3>
							<p>From business to education to personal queries</p>
						</motion.div>
						<motion.div 
							variants={cardHover}
							transition={{ duration: 0.8, ease: "easeOut" }} 
							className={styles.featureCard}
							onClick={() => handleFeatureClick("Lightning Fast")}
							style={{ cursor: 'pointer' }}
						>
							<h3>Lightning Fast</h3>
							<p>Powered by Fikra Ai for instant intelligent responses</p>
						</motion.div>
					</div>
				</motion.div>
			</motion.section>

			{/* Benefits Section */}
			<motion.section 
				className={styles.benefits}
				variants={sectionHover}
			>
				<motion.div
					variants={staggerContainer}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className={styles.benefitsContainer}
				>
					<motion.div variants={fadeInUp} transition={{ duration: 0.8, ease: "easeOut" }} className={styles.benefitsText}>
						<p>🔹 With Fikra AI, conversations feel effortless, intelligent, and secure.</p>
						<p>🔹 Unlock the power of AI – built to empower your ideas and accelerate your growth.</p>
					</motion.div>
				</motion.div>
			</motion.section>

			{/* Technology Section */}
			<motion.div
				variants={sectionHover}
			>
				<Section
					src={ui1}
					alt='Fikra AI Technology'
					animateImg={true}
					imgStyle={styles.ui1}
					reverse={false}>
					<h2>| POWERED BY Fikra Ai</h2>
					<h1>
						BUILT TO <span className={styles.highlight}>EMPOWER YOUR IDEAS</span>
					</h1>
					<p>
						Experience the future of AI conversation with our advanced platform. 
						Fikra AI combines cutting-edge technology with intuitive design to 
						provide intelligent assistance that adapts to your unique needs.
					</p>
					<NavLink to='/signup' className={styles.btn}>
						Join Fikra AI
					</NavLink>
				</Section>
			</motion.div>
		</div>
	);
};

export default Home;
