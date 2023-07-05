import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import axios from 'axios';
import './MyInfo.css';

interface MyInfoChangeProps {
	myData: any;
	onClose: () => void;
}

const MyInfoChange: React.FC<MyInfoChangeProps> = ({ myData, onClose }) => {
	const [avatarUrl, setAvatarUrl] = useState(myData.avatar);
	const [newNickName, setNewNickName] = useState(myData.nickName);
	const [text, setText] = useState<string>("");

	const [changeData, setChangeData] = useState({
		avatar: myData.avatar,
		intraId: myData.intraId,
		nickName: myData.nickName
	});

	const handleAvatarButtonClick = (newAvatarUrl: string) => {
		setAvatarUrl(newAvatarUrl);
		setChangeData(prevData => ({
			...prevData,
			avatar: newAvatarUrl
		}));
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setText(e.target.value);
	};

	const onReset = () => {
		setChangeData(prevData => ({
			...prevData,
			nickName: text
		}));
		// setText("");
	};

	const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			onReset();
		}
	};

	const handleModifyClick = () => {
		console.log(changeData);

		if (myData.nickName !== changeData.nickName){
			axios.patch("http://localhost:5001/member/update/nick/", 
			{
				"intraId": changeData.intraId,
  				"nickName": changeData.nickName
			})
			.then(function (response) {
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
		}
		console.log(changeData)
		if (myData.avatar !== changeData.avatar){
			axios.patch("http://localhost:5001/member/update/avatar/",
			{
				"intraId": changeData.intraId,
  				"avatar": changeData.avatar
			})
			.then(function (response) {
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
		}
		// axios.post("http://localhost:5001/auth/refresh").then((res) => {
			// console.log(res.data);
			axios.get('http://localhost:5001/auth/me').then((response => {
				// console.log(response);
				myData = response.data; 
			}))
		// });
		onClose();
<<<<<<< HEAD
		window.location.reload();
=======
>>>>>>> socket-chat
	};

	return (
		<div className="my-info-change">
			<img className="my-info-change-close" src="close_button.svg" alt="Close" onClick={onClose} width={28} height={28} style={{ cursor: 'pointer' }}/>
			<img
				className="my-info-change-avatar"
				src={avatarUrl}
				alt="User Avatar"
			/>
			<div className="my-info-change-avatar-buttons">
				<button className="my-info-change-avatar-button" onClick={() => handleAvatarButtonClick("avatar/haaland.jpeg")}>
					기본1
				</button>
				<button className="my-info-change-avatar-button" onClick={() => handleAvatarButtonClick("avatar/son.jpeg")}>
					기본2
				</button>
				<button className="my-info-change-avatar-button" onClick={() => handleAvatarButtonClick("avatar/yyoo.jpeg")}>
					기본3
				</button>
			</div>
			<div className="my-info-change-nick-box">
				<div>닉네임</div>

				<input
					placeholder='검색'
					onChange={onChange}
					onKeyPress={onKeyPress}
					value={text}
					maxLength={12}
				/>
				<button className="my-info-change-nick-submit" onClick={onReset}>제출</button>
				</div>
			<button className="my-info-change-set-button" onClick={handleModifyClick}>수정</button>
		</div>
	)
}

export default MyInfoChange;
