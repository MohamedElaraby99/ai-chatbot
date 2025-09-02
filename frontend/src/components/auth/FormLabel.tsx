import { ChangeEvent, useMemo, useState } from "react";

import styles from "./FormLabel.module.css";

type Props = {
	className?: string;
	htmlFor: string;
	label: string;
	type: string;
	id: string;
	required: boolean;
	maxLength: number;
	minLength: number;
	value?: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	inputPH?: string;
	labelPH?: string;
    name:string
};

const FormLabel = (props: Props) => {
	const isPasswordField = useMemo(() => props.type === 'password', [props.type]);
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const effectiveType = isPasswordField && isPasswordVisible ? 'text' : props.type;

	return (
		<div className={`${styles.label} ${props.className}`}>
			<label htmlFor={props.htmlFor} placeholder={props.labelPH}>
				{props.label}
			</label>
			<div className={styles.inputWrapper}>
				<input
					type={effectiveType}
					id={props.id}
                name={props.name}
					required={props.required}
					maxLength={props.maxLength}
					minLength={props.minLength}
					value={props.value}
					onChange={props.onChange}
					placeholder={props.inputPH}
				/>
				{isPasswordField && (
					<button
						type="button"
						className={styles.toggle}
						aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
						onClick={() => setIsPasswordVisible(v => !v)}
					>
						{isPasswordVisible ? (
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
								<path d="M15 9l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
								<path d="M9 9l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
								<circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
							</svg>
						) : (
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
								<circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
							</svg>
						)}
					</button>
				)}
			</div>
		</div>
	);
};

export default FormLabel;
