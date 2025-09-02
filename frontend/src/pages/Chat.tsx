import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import styles from "./Chat.module.css";
import ChatItem from "../components/chat/ChatItem";
import {
	deleteAllChats,
	getAllChats,
	postChatRequest,
} from "../../helpers/api-functions";

import sendIcon from "/logos/send-icon.png";
import noMsgBot from "/logos/no-msg2.png";
import upArrow from "/logos/up-arrow.png";
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
	const [deleteChatToggle, setDeleteChatToggle] = useState<boolean>(false);

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

	const deleteChatsToggle = () => {
		setDeleteChatToggle((prevState) => !prevState);
	};

	const clearChatsHandler = async () => {
		try {
			toast.loading("Deleting Messages ...", { id: "delete-msgs" });
			const data = await deleteAllChats();
			setChatMessages(data.chats);
			setDeleteChatToggle(false);
			toast.success("Deleted Messages Successfully", { id: "delete-msgs" });
		} catch (error: any) {
			toast.error(error.message, { id: "delete-msgs" });
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

	const logo = {
		animate: {
			y: [0, -5, 0, -5, 0],
			transition: {
				type: "spring",
				y: {
					repeat: Infinity,
					duration: 4,
					stiffness: 100,
					damping: 5,
				},
			},
		},
		animateReverse: {
			transform: "rotate(180deg)",
			y: "-4",
			transition: {
				duration: 0.5,
			},
		},
		initialBtn: {
			y: "4",
			opacity: 0,
		},
		animateBtn: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
			},
		},
		exitBtn: {
			y: "-20",
			opacity: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	const placeHolder = (
		<div className={styles.no_msgs}>
			<h3>Gemini 2.0 Flash</h3>
			<motion.div
				className={styles.no_msg_logo}
				variants={variants}
				animate='animate'>
				<img alt='no msg bot' src={noMsgBot}></img>
			</motion.div>
			<p>
				It's quiet in here! Be the first to break the silence and send a message
				to get the conversation going.
			</p>
			<small className={styles.hint}>
				💡 Press Enter to send, Shift+Enter for new line
			</small>
		</div>
	);

	const chats = chatMessages.map((chat, index) => (
		<ChatItem
			key={`${chat.role}-${index}-${Date.now()}`}
			content={chat.content}
			role={chat.role}
		/>
	));

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
					<div className={styles.eraseMsgs}>
						<motion.img
							variants={logo}
							animate={!deleteChatToggle ? "animate" : "animateReverse"}
							src={upArrow}
							alt='top icon'
							onClick={deleteChatsToggle}
							className={styles.eraseIcon}
						/>
						<AnimatePresence>
							{deleteChatToggle && (
								<motion.button
									className={styles.eraseBtn}
									onClick={clearChatsHandler}
									variants={logo}
									initial='initialBtn'
									animate='animateBtn'
									exit='exitBtn'>
									CLEAR CHATS
								</motion.button>
							)}
						</AnimatePresence>
					</div>
					<div className={styles.inputWrapper}>
						<textarea
							className={styles.textArea}
							maxLength={1500}
							ref={inputRef}
							rows={1}
							disabled={isLoadingChats || isLoading}
							placeholder='Type your message here... (Enter to send, Shift+Enter for new line)'
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
		</div>
	);
};

export default Chat;
