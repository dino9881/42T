import React, { useState, useEffect } from "react";

const Timer = () => {
const MINUTES_IN_MS = 1 * 60 * 1000;
const INTERVAL = 1000;
const [timeLeft, setTimeLeft] = useState<number>(MINUTES_IN_MS);
const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
const [isTimerEnded, setIsTimerEnded] = useState<boolean>(false);
const [verificationCode, setVerificationCode] = useState<string>("");

const minutes = String(Math.floor((timeLeft / (1000 * 60)) % 60)).padStart(2, "0");
const seconds = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0");

useEffect(() => {
	let timer: NodeJS.Timeout | null = null;

	if (isTimerRunning) {
	timer = setInterval(() => {
		setTimeLeft((prevTime) => prevTime - INTERVAL);
	}, INTERVAL);
	}

	if (timeLeft <= 0) {
	setIsTimerEnded(true);
	setIsTimerRunning(false);
	}

	return () => {
	if (timer !== null) {
		clearInterval(timer);
	}
	};
}, [isTimerRunning, timeLeft]);

const handleTimerRestart = () => {
	setTimeLeft(MINUTES_IN_MS);
	setIsTimerEnded(false);
	setIsTimerRunning(true);
};

const handleVerificationCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	setVerificationCode(event.target.value);
};

const handleVerificationCodeSubmit = () => {
	// if (isTimerEnded) {
	// console.log("제출 할 수 없음");
	// } else {
	// console.log("인증 코드 제출:", verificationCode);
	// }
};

const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
	if (event.key === "Enter") {
	handleVerificationCodeSubmit();
	}
};

return (
	<div>
	<div>
		{minutes}:{seconds}
	</div>
	{isTimerEnded ? (
		<button onClick={handleTimerRestart}>Restart Timer</button>
	) : (
		<div>
		<input
			type="text"
			value={verificationCode}
			onChange={handleVerificationCodeChange}
			onKeyDown={handleKeyDown}
			placeholder="Verification Code"
		/>
		<button onClick={handleVerificationCodeSubmit}>Submit</button>
		</div>
	)}
	</div>
);
};

export default Timer;
