import React from 'react';
import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import setAuthorizationToken from '../setAuthorizationToken';
import './SetNick.css';

interface MyData  {
	avatar: string;
	intraId: string;
	nickName: string;
  };

const SetNick = () => {
	const [text, setText] = useState<string>("");

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		// 한글을 제외한 다른 문자만 필터링하여 입력값으로 사용
		const filteredText = e.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
		setText(filteredText);
	  };

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
		onClick();
		}
	};
	
	const {state} = useLocation();
	const navigate = useNavigate();
	const {intraId} = state || {
		intraId: ""
	};
	
	const myData:MyData = {
		"intraId": intraId,
		"avatar": "avatar/avatar.jpeg",
		"nickName": ""
	}
	if (!myData.intraId)
	{
		navigate('/')
	}

	const onClick = () => {
		const isAlpha = /^[a-zA-Z]+$/.test(text);

		if (!isAlpha) {
		alert("닉네임은 영어만 가능합니다.");
		return;
		}
		myData.nickName = text
		
		axios.post(`${process.env.REACT_APP_BACK_URL}/member/create`, myData)
		.then(function (response) {
			axios.post(`${process.env.REACT_APP_BACK_URL}/auth/login`, { intraId: myData.intraId })
				.then((res) => {
					const token = res.data.access_token;
					localStorage.setItem("jwtToken", token);
					setAuthorizationToken(token);
					navigate("/main");
				})
				
		})
		.catch(function (error) {
			if (error.response.status === 409) {
				alert("사용할 수 없는 닉네임이거나 이미 존재하는 사용자입니다.")
			}
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
						maxLength={8}/>
					<button className='set-nick-button'onClick={onClick}>닉네임설정</button>
				</div>
			</div>
		</div>
	);
};

export default SetNick;
