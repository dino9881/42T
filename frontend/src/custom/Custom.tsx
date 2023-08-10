import React, { useState,  useEffect, ChangeEvent } from "react";
import { socket } from "../socket";
import instance from "../refreshToken";
import "./Custom.css";

interface CustomProps {
	nickName: string;
	onClose: () => void;
}

const Custom: React.FC<CustomProps> = ({ nickName, onClose }) => {
	const [selectedCheckbox, setSelectedCheckbox] = useState("");
	const [submitChecker, setSubmitChecker] = useState(0);

	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSelectedCheckbox(event.target.value);
	};

	const handleSubmit = () => {
		instance.get('http://localhost:5001/auth/me').then((response) => {
			var mode;
			if (selectedCheckbox === "checkbox1")
			mode = 0
			else if (selectedCheckbox === "checkbox2")
			mode = 1
			else if (selectedCheckbox === "checkbox3")
			mode = 2
			console.log({intraId : response.data.intraId, nickName : response.data.nickName  , player2: nickName , mode : mode});
            socket.emit("game-apply", {intraId : response.data.intraId, nickName : response.data.nickName  , player2: nickName, mode : mode });
			setSubmitChecker(1);
		});
		// 제출 버튼 동작 처리
		console.log("선택된 체크박스:", selectedCheckbox);
		// 추가로 원하는 동작 수행
	};

	useEffect(() => {
		if (submitChecker === 1) {
			const timer = setTimeout(() => {
				onClose();
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [submitChecker, onClose]);

	return (
		<div className="custom">
			<div className="custom-box">
				<img className="custom-close" src="close_button.svg" alt="Close" onClick={onClose} width={18} height={18} style={{ cursor: 'pointer' }}/>
				{!submitChecker ? (
					<>
						<div>
							{nickName} 에게 게임을 신청합니다.
						</div>
						<div className="custom-checkbox-buttons">
						<label className={`custom-checkbox-size ${selectedCheckbox === "checkbox1" ? "selected" : ""}`}>
							Easy
							<input type="checkbox" value="checkbox1" checked={selectedCheckbox === "checkbox1"} onChange={handleCheckboxChange} />
						</label>
						<label className={`custom-checkbox-size ${selectedCheckbox === "checkbox2" ? "selected" : ""}`}>
							normal
							<input type="checkbox" value="checkbox2" checked={selectedCheckbox === "checkbox2"} onChange={handleCheckboxChange} />
						</label>
						<label className={`custom-checkbox-size ${selectedCheckbox === "checkbox3" ? "selected" : ""}`}>
							hard(ghost)
							<input type="checkbox" value="checkbox3" checked={selectedCheckbox === "checkbox3"} onChange={handleCheckboxChange}/>
						</label>
						</div>
						<button className="custom-submit-button" onClick={handleSubmit}>
							신청하기
						</button>
					</>
				)
				 : (
					<div>신청 완료!</div>
				)}
			</div>
		</div>
	);
};

export default Custom;
