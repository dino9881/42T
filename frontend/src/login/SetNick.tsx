import React from 'react';
import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import setAuthorizationToken from '../setAuthorizationToken';
import './SetNick.css';

const SetNick = () => {
	const [text, setText] = useState<string>("");

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
	  setText(e.target.value);
	};

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
		  onClick();
		}
	  };
	
	const location = useLocation();
	const navigate = useNavigate();

	const myData:any = {
		"intraId": location.state.intraId,
		"avatar": "img/avatar.jpeg",
		"rank": 100
	}

	const onClick = () => {
		console.log(location.state.intraId);
		console.log(text);

		myData.nickName = text
		axios.post('http://localhost:5001/member/create', myData)
		.then(function (response) {
			console.log(response);
			axios.post("http://localhost:5001/auth/login", { intraId: myData.intraId })
				.then((res) => {
					const token = res.data.access_token;
					// console.log(token);
					localStorage.setItem("jwtToken", token);
					setAuthorizationToken(token);
					navigate("/main");
				})
		})
		.catch(function (error) {
			console.log(error);
		});
		
	};


	return (
		<div className='login-background-l'>
			<div className='login-background-s'>
				<div className='login-block'>
					<div className='title-text'>42트</div>
					<input
						className='set-nick-input'
						placeholder='닉네임'
						onChange={onChange}
						onKeyDown={onKeyDown}
						value={text}
						maxLength={12}/>
					<button className='set-nick-button'onClick={onClick}>닉네임설정</button>
				</div>
			</div>
		</div>
	);
};

export default SetNick;
