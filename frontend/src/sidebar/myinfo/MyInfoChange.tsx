import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import instance from "../../refreshToken";
import './MyInfo.css';

interface MyData {
	intraId: string;
	avatar: string;
	nickName: string;
  }

interface MyInfoChangeProps {
	myData: MyData;
	onClose: () => void;
}

const MyInfoChange: React.FC<MyInfoChangeProps> = ({ myData, onClose }) => {
	const [avatarUrl, setAvatarUrl] = useState(myData.avatar);
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
		if (changeData.nickName === text) {
			alert("기존 닉네임 입니다.")
			return
		}
		else if (changeData.nickName === "admin") {
			alert("사용할 수 없는 닉네임 입니다.")
			return
		}
		else {
			instance.get(`http://localhost:5001/member/search/${text}`)
			.then((res) => {
				alert("사용할 수 없는 닉네임 입니다.")
			})
			.catch(function (error) {
				if (error.response.status === 404) {
					setChangeData(prevData => ({
						...prevData,
						nickName: text
					}));
				}
			});
		}
	};

	const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			onReset();
		}
	};

	const handleModifyClick = () => {
		console.log(changeData);

		if (myData.nickName !== changeData.nickName){
			instance.patch("http://localhost:5001/member/update/nick/", 
			{
				"intraId": changeData.intraId,
				"nickName": changeData.nickName
			})
			.then(function (response) {
				instance.patch("http://localhost:5001/channel/update/nick/")
				.then((res) => {
					console.log(res);
				})
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
		}
		console.log(changeData)
		if (myData.avatar !== changeData.avatar){
			instance.patch("http://localhost:5001/member/update/avatar/",
			{
				"intraId": changeData.intraId,
				"avatar": changeData.avatar
			})
			.then(function (response) {
			})
			.catch(function (error) {
				console.log(error);
			});
		}

		instance.get('http://localhost:5001/auth/me').then((response => {
			myData = response.data; 
		}))
		onClose();
		window.location.reload();
	};

	const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				const base64Image = reader.result as string;
				setAvatarUrl(base64Image);
				setChangeData(prevData => ({
					...prevData,
					avatar: base64Image
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="my-info-change">
			<img className="my-info-change-close" src="close_button.svg" alt="Close" onClick={onClose} width={28} height={28} style={{ cursor: 'pointer' }}/>
			<img
				className="my-info-change-avatar"
				src={avatarUrl}
				alt="User Avatar"
			/>
			<div className="my-info-change-avatar-box">
				<div className="my-info-change-avatar-buttons">
					<button className="my-info-change-avatar-button" onClick={() => handleAvatarButtonClick("avatar/avatar1.jpeg")}>
						기본1
					</button>
					<button className="my-info-change-avatar-button" onClick={() => handleAvatarButtonClick("avatar/avatar2.jpeg")}>
						기본2
					</button>
					<button className="my-info-change-avatar-button" onClick={() => handleAvatarButtonClick("avatar/avatar3.jpeg")}>
						기본3
					</button>
					<button className="my-info-change-avatar-button" onClick={() => handleAvatarButtonClick(`${myData.avatar}`)}>
						내사진
					</button>
				</div>
				<input type="file" accept="image/*" onChange={handleUpload} />
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
				<button className="my-info-change-nick-submit" onClick={onReset}>확인</button>
				</div>
			<button className="my-info-change-set-button" onClick={handleModifyClick}>수정</button>
		</div>
	)
}

export default MyInfoChange;
