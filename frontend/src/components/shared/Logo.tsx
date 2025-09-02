import styles from "./Logo.module.css";
import logo from "/logos/home-bot-icon.png";

const Logo = () => {
	return (
		<div className={styles.parent}>
				<img src={logo} alt='logo' className={styles.logo} style={{ width: "60px", height: "60px" }} />
				<p className={styles.logo_p}>
					<span className={styles.span}>Fikra Ai</span>
				</p>
		</div>
	);
};

export default Logo;
