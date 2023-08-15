import React, { useState, useEffect } from 'react';
import instance from '../refreshToken';
import './CheckEmail.css'

interface MyData  {
	avatar: string;
	intraId: string;
	nickName: string;
	rank: number;
	winCnt: number;
	loseCnt: number;
  };

interface EmailProps {
	myData:MyData;
	onClose: () => void;
	onEmail: () => void;
}

const CheckEmail: React.FC<EmailProps> = ({ myData, onClose, onEmail }) => {
	const MINUTES_IN_MS = 5 * 60 * 1000;
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

	useEffect(() => {
		instance.get("http://localhost:5001/member/mail/send").then(() => {
		})
	}, []);

	const handleTimerRestart = () => {
		setTimeLeft(MINUTES_IN_MS);
		setIsTimerEnded(false);
		setIsTimerRunning(true);
		instance.get("http://localhost:5001/member/mail/send").then(() => {
		})
	};
	
	const handleVerificationCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setVerificationCode(event.target.value);
	};
	
	const handleVerificationCodeSubmit = () => {
		if (isTimerEnded) {
		console.log("제출 할 수 없음");
		} else {
			instance.post("http://localhost:5001/member/mail/verify",
			{ 
				"code": verificationCode
			})
			.then((response) => {
					onEmail();
					onClose();
			})
			.catch(function (error) {
				alert("인증번호가 틀립니다.")
				onClose();
			});
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
		handleVerificationCodeSubmit();
		}
	};

	return (
		<div className='login-background'>
			<div className="check-email-box">
				<img className="check-email-close" src="close_button.svg" alt="Close" onClick={onClose} width={28} height={28} style={{ cursor: 'pointer' }}/>
				<div className="text-box">
					<div style={{fontSize: "25px"}}>
						다음 이메일로 인증번호가 발송됩니다.
					</div>
					<div className='check-email-text'>
						{myData.intraId}@student.42seoul.kr
					</div>
				</div>
				<div className="button-box">
					{isTimerEnded ? (
						<button onClick={handleTimerRestart} className='nick-time-restart'>Restart Timer</button>
						) : (
							<div className='check-email-input-box'>
								<input className='check-email-input'
									type="text"
									onInput={(e: any) =>
									(e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
									value={verificationCode}
									onChange={handleVerificationCodeChange}
									onKeyDown={handleKeyDown}
									placeholder="인증 코드 입력"
									/>
								<button onClick={handleVerificationCodeSubmit} className='check-email-submit-button'>제출</button>
							</div>
						)
					}
					<div className='check-email-time-text'> {minutes}:{seconds} </div>
				</div>
			</div>
		</div>
	);
};

export default CheckEmail