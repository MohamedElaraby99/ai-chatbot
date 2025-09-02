import ReactMarkdown from 'react-markdown'
import reactGFM from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight';
import { motion } from 'framer-motion';

import styles from "./ChatItem.module.css";
import 'highlight.js/styles/atom-one-dark.css';

import botIcon from "/logos/bot.png";
import { useAuth } from "../../context/context";

type Props = {
	content: string;
	role: string;
};

const ChatItem = (props: Props) => {
	
	const auth = useAuth();

	const messageVariants = {
		hidden: { 
			opacity: 0, 
			y: 20,
			scale: 0.95
		},
		visible: { 
			opacity: 1, 
			y: 0,
			scale: 1,
			transition: {
				duration: 0.4,
				ease: "easeOut"
			}
		}
	};

	const botMsg = (
		<div className={styles.messageWrapper}>
			<motion.div 
				className={`${styles.parent} ${styles.bot_parent}`}
				variants={messageVariants}
				initial="hidden"
				animate="visible"
			>
				<div className={`${styles.avatar}`}>
					<img src={botIcon} alt='chat bot icon'></img>
				</div>
				<div className={`${styles.msg} ${styles.bot_msg} markdown-body`}>
					<ReactMarkdown remarkPlugins={[reactGFM]} rehypePlugins={[rehypeHighlight]}>  
						{props.content}
					</ReactMarkdown>
				</div>
			</motion.div>
		</div>
	);

	const userMsg = (
		<div className={styles.messageWrapper}>
			<motion.div 
				className={`${styles.parent} ${styles.user_parent}`}
				variants={messageVariants}
				initial="hidden"
				animate="visible"
			>
				<div className={`${styles.avatar} ${styles.user_avatar}`}>
					{auth?.user?.name?.[0] || 'U'}
					{auth?.user?.name?.split(" ")?.[1]?.[0] || ''}
				</div>
				<div className={styles.msg}>
					<p>{props.content}</p>
				</div>
			</motion.div>
		</div>
	);

	return (
		<>
			{props.role === "assistant" && botMsg}
			{props.role === "user" && userMsg}
		</>
	);
};

export default ChatItem;
