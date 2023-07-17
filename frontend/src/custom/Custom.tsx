import React, { useState, ChangeEvent } from "react";
import { socket } from "../socket";
import instance from "../refreshToken";
import "./Custom.css";

interface CustomProps {
	nickName: string;
	onClose: () => void;
}

const Custom: React.FC<CustomProps> = ({ nickName, onClose }) => {
	const [selectedCheckbox, setSelectedCheckbox] = useState("");

	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSelectedCheckbox(event.target.value);
	};

	const handleSubmit = () => {
		instance.get('http://localhost:5001/auth/me').then((response) => {
			console.log({intraId : response.data.intraId, nickName : response.data.nickName  , player2: nickName });
            socket.emit("game-apply", {intraId : response.data.intraId, nickName : response.data.nickName  , player2: nickName });
		});
		// 제출 버튼 동작 처리
		console.log("선택된 체크박스:", selectedCheckbox);
		// 추가로 원하는 동작 수행
	};

	return (
		<div className="custom">
		<img className="my-info-change-close" src="close_button.svg" alt="Close" onClick={onClose} width={18} height={18} style={{ cursor: 'pointer' }}/>
		<div className="custom-box">
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
		</div>
		</div>
	);
};

export default Custom;
