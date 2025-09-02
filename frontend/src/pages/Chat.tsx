import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import styles from "./Chat.module.css";
import ChatItem from "../components/chat/ChatItem";
import {
	getAllChats,
	postChatRequest,
	deleteAllChats,
} from "../helpers/api-functions";

import sendIcon from "/logos/send-icon.png";
import noMsgBot from "/logos/no-msg2.png";
import ChatLoading from "../components/chat/ChatLoading";

import { useAuth } from "../context/context";
import SpinnerOverlay from "../components/shared/SpinnerOverlay";
import toast from "react-hot-toast";

type Message = {
	role: "user" | "assistant";
	content: string;
};

const Chat = () => {
	const auth = useAuth();
	const navigate = useNavigate();

	const [chatMessages, setChatMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
	const [isClearing, setIsClearing] = useState<boolean>(false);
	const [showConfirm, setShowConfirm] = useState<boolean>(false);

	const inputRef = useRef<HTMLTextAreaElement | null>(null);
	const messageContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (messageContainerRef.current) {
			messageContainerRef.current.scrollTop =
				messageContainerRef.current.scrollHeight;
		}
	}, [chatMessages]);

	useLayoutEffect(() => {
		const getChats = async () => {
			try {
				if (auth?.isLoggedIn && auth.user) {
					const data = await getAllChats();
					setChatMessages([...data.chats]);
				}
				setIsLoadingChats(false);
			} catch (err) {
				console.log(err);
				setIsLoadingChats(false);
			}
		};
		getChats();
	}, [auth]);

	useEffect(() => {
		if (!auth?.user) {
			return navigate("/login");
		}
	}, [auth]);

	const sendMsgHandler = async () => {
		const content = inputRef.current?.value?.trim();
		
		if (!content || content.length === 0) return;

		if (inputRef.current) inputRef.current.value = "";

		const newMessage: Message = { role: "user", content };
		setChatMessages((prev) => [...prev, newMessage]);

		// send request to backend
		setIsLoading(true);
		try {
			const chatData = await postChatRequest(content);
			setChatMessages([...chatData.chats]);
		} catch (error: any) {
			toast.error(error.message || "Failed to send message");
			// Remove the user message if the request failed
			setChatMessages((prev) => prev.slice(0, -1));
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMsgHandler();
		}
	};

	const variants = {
		animate: {
			y: [0, -10, 0, -10, 0],
			transition: {
				type: "spring",
				y: { repeat: Infinity, duration: 4, stiffness: 100, damping: 5 },
			},
		},
	};



	const placeHolder = (
		<>
<div className={styles.no_msgs}>
			<h3 >Fikra Ai</h3>
			<motion.div
				className={styles.no_msg_logo}
				variants={variants}
				animate='animate'>
				<img alt='no msg bot' src={noMsgBot}></img>
			</motion.div>
		</div>
		<p className={styles.hint} style={{ textAlign: "center" }}>How can I help you today?</p>
		</>
		
	);

	const chats = chatMessages.map((chat, index) => (
		<ChatItem
			key={`${chat.role}-${index}-${Date.now()}`}
			content={chat.content}
			role={chat.role}
		/>
	));

	const performClearChats = async () => {
		if (isLoading || isLoadingChats || isClearing) return;
		try {
			setIsClearing(true);
			await deleteAllChats();
			setChatMessages([]);
			toast.success("Chat history cleared");
		} catch (error: any) {
			toast.error(error.message || "Failed to clear chats");
		} finally {
			setIsClearing(false);
			setShowConfirm(false);
		}
	};

	const closeConfirmModal = () => {
		setShowConfirm(false);
	};

	const openConfirmModal = () => {
		setShowConfirm(true);
	};

	return (
		<div className={styles.parent}>
			<div className={styles.chat} ref={messageContainerRef}>
				{isLoadingChats && <SpinnerOverlay />}
				{!isLoadingChats && (
					<>
						{chatMessages.length === 0 && placeHolder}
						{chatMessages.length !== 0 && chats}
						{isLoading && <ChatLoading />}
					</>
				)}
			</div>
			<div className={styles.inputContainer}>
				<div className={styles.inputArea}>
					<div className={styles.inputWrapper}>
						{chatMessages.length > 0 && !isClearing && (
							<motion.button 
								className={`${styles.icon} ${styles.clearButton} ${(isLoading || isLoadingChats) ? styles.disabled : ''}`} 
								onClick={openConfirmModal}
								disabled={isLoading || isLoadingChats}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								transition={{ duration: 0.1 }}
								aria-label="Clear chat history"
								title="Clear chat history"
							>
								Clear
							</motion.button>
						)}
						<textarea
							className={styles.textArea}
							maxLength={1500}
							ref={inputRef}
							rows={1}
							disabled={isLoadingChats || isLoading}
							placeholder='Message Fikra Ai...'
							onKeyDown={handleKeyPress}
							onInput={(e) => {
								// Auto-resize textarea
								const target = e.target as HTMLTextAreaElement;
								target.style.height = 'auto';
								target.style.height = Math.min(target.scrollHeight, 120) + 'px';
							}}
						/>
						<motion.button 
							className={`${styles.icon} ${isLoading ? styles.disabled : ''}`} 
							onClick={sendMsgHandler}
							disabled={isLoading}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							transition={{ duration: 0.1 }}
						>
							<img alt='send icon' src={sendIcon} />
						</motion.button>
					</div>
				</div>
			</div>

			{showConfirm && (
				<div className={styles.confirmModalOverlay}>
					<div className={styles.confirmModalContent}>
						<h2>Confirm Clear Chat History</h2>
						<p>Are you sure you want to delete all chat history? This action cannot be undone.</p>
						<div className={styles.confirmModalButtons}>
							<button onClick={closeConfirmModal} className={styles.cancelButton}>Cancel</button>
							<button onClick={performClearChats} className={styles.confirmButton}>Clear</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Chat;
