import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import './CheckEmail.css'

const CheckEmail = () => {
	const [text, setText] = useState<string>("");

	const location = useLocation();
	// console.log(location.state);
	const navigate = useNavigate();

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
	  setText(e.target.value);
	};
  
	const onReset = () => {
		setText("");
	};

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
		  onReset();
		}
	};

	//   const onChancle = () => {
	// 	console.log('취소');
	// };



	return (
		<div className='login-background-l'>
			<div className='login-background'>
				<div className="check-email-box">
					<div className="text-box">
						<div style={{fontSize: "25px"}}>
							다음 이메일로 인증번호가 발송됩니다.
						</div>
						<div className='check-email-text'>
							{location.state.intraId}@student.42seoul.kr
						</div>
					</div>
					<div className="button-box">
						<div className='check-email-input-box'>
							<input
								id='check-email-input'
								placeholder='인증번호'
								onChange={onChange}
								onKeyDown={onKeyDown}
								value={text}
								maxLength={12}
							/>
						</div>
						<button id='check-email-button' onClick={onReset}>확인</button>
						{/* <Link to='/main'> <button id='check-email-button' onClick={onReset}>확인</button> </Link> */}
						{/* <Link to='/'><button id='cancel-button' onClick={onChancle}>취소</button></Link> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckEmail