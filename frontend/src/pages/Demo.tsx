import { useState } from "react";
import { motion } from "framer-motion";
import { submitDemoRequest } from "../../helpers/api-functions";
import styles from "./Demo.module.css";

const Demo = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		company: "",
		useCase: "",
		message: ""
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus("idle");

		try {
			await submitDemoRequest(formData);
			setSubmitStatus("success");
			setFormData({
				name: "",
				email: "",
				company: "",
				useCase: "",
				message: ""
			});
		} catch (error) {
			console.error('Error submitting demo request:', error);
			setSubmitStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	const fadeInUp = {
		initial: { opacity: 0, y: 60 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.8, ease: "easeOut" }
	};

	return (
		<div className={styles.container}>
			{/* Background Effects */}
			<div className={styles.backgroundEffects}>
				<div className={styles.particle}></div>
				<div className={styles.particle}></div>
				<div className={styles.particle}></div>
				<div className={styles.particle}></div>
				<div className={styles.particle}></div>
				<div className={styles.particle}></div>
			</div>

			<motion.div 
				className={styles.content}
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<motion.div 
					className={styles.header}
					variants={fadeInUp}
					initial="initial"
					animate="animate"
				>
					<h1>Try Fikra AI Demo</h1>
					<p>Experience the power of AI conversation. Fill out the form below and we'll get back to you with access to our demo.</p>
				</motion.div>

				<motion.form 
					className={styles.form}
					onSubmit={handleSubmit}
					variants={fadeInUp}
					initial="initial"
					animate="animate"
					transition={{ delay: 0.2 }}
				>
					<div className={styles.formGroup}>
						<label htmlFor="name">Full Name *</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							required
							placeholder="Enter your full name"
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="email">Email Address *</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							required
							placeholder="Enter your email address"
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="company">Company/Organization</label>
						<input
							type="text"
							id="company"
							name="company"
							value={formData.company}
							onChange={handleInputChange}
							placeholder="Enter your company name (optional)"
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="useCase">Primary Use Case *</label>
						<select
							id="useCase"
							name="useCase"
							value={formData.useCase}
							onChange={handleInputChange}
							required
						>
							<option value="">Select your primary use case</option>
							<option value="business">Business & Professional</option>
							<option value="education">Education & Learning</option>
							<option value="personal">Personal Assistant</option>
							<option value="research">Research & Development</option>
							<option value="customer-support">Customer Support</option>
							<option value="other">Other</option>
						</select>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="message">Additional Details</label>
						<textarea
							id="message"
							name="message"
							value={formData.message}
							onChange={handleInputChange}
							rows={4}
							placeholder="Tell us more about how you plan to use Fikra AI (optional)"
						/>
					</div>

					<button 
						type="submit" 
						className={styles.submitBtn}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Submitting..." : "Request Demo Access"}
					</button>

					{submitStatus === "success" && (
						<motion.div 
							className={styles.successMessage}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
						>
							✅ Thank you! We've received your demo request. We'll contact you within 24 hours.
						</motion.div>
					)}

					{submitStatus === "error" && (
						<motion.div 
							className={styles.errorMessage}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
						>
							❌ Something went wrong. Please try again or contact support.
						</motion.div>
					)}
				</motion.form>

				<motion.div 
					className={styles.info}
					variants={fadeInUp}
					initial="initial"
					animate="animate"
					transition={{ delay: 0.4 }}
				>
					<h3>What happens next?</h3>
					<div className={styles.steps}>
						<div className={styles.step}>
							<div className={styles.stepNumber}>1</div>
							<p>Submit your information</p>
						</div>
						<div className={styles.step}>
							<div className={styles.stepNumber}>2</div>
							<p>We'll review your request</p>
						</div>
						<div className={styles.step}>
							<div className={styles.stepNumber}>3</div>
							<p>Get demo access within 24 hours</p>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default Demo;
