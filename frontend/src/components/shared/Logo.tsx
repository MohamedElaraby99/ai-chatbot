import { Link } from "react-router-dom";

import styles from "./Logo.module.css";
import logo from "/logos/home-bot-icon.png";

const Logo = () => {
	return (
		<div className={styles.parent}>
				<Link to={"/"}>
					<img src={logo} alt='logo' className={styles.logo} style={{ width: "60px", height: "60px" }} />
				</Link>
				<p className={styles.logo_p}>
					<span className={styles.span}>Fikra Ai</span>
				</p>
		</div>
	);
};

export default Logo;
