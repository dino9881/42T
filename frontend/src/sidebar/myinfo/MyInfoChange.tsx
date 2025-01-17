import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import instance from "../../refreshToken";
import './MyInfo.css';

interface MyData {
	intraId: string;
	avatar: string;
	nickName: string;
	twoFactor: boolean;
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
		nickName: myData.nickName,
		twoFactor: myData.twoFactor
	});

	const [twoFactor, setTwoFactor] = useState<boolean>(myData.twoFactor)

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
			instance.get(`${process.env.REACT_APP_BACK_URL}/member/search/${text}`)
			.then((res) => {
				alert("사용할 수 없는 닉네임 입니다.")
			})
			.catch(function (error) {
				if (error.response.status === 404) {
					setChangeData(prevData => ({
						...prevData,
						nickName: text
					}));
					alert("사용가능한 닉네임입니다.");
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

		if (myData.nickName !== changeData.nickName){
			instance.patch(`${process.env.REACT_APP_BACK_URL}/member/update/nick/`, 
			{
				"intraId": changeData.intraId,
				"nickName": changeData.nickName
			})
			.then(function (response) {
				instance.patch(`${process.env.REACT_APP_BACK_URL}/channel/update/nick/`)
				.then((res) => {
				})
			})
			.catch(function (error) {
			});
		}
		if (myData.avatar !== changeData.avatar){
			instance.patch(`${process.env.REACT_APP_BACK_URL}/member/update/avatar/`,
			{
				"intraId": changeData.intraId,
				"avatar": changeData.avatar
			});
		}
		if (myData.twoFactor !== twoFactor) {
			instance.patch(`${process.env.REACT_APP_BACK_URL}/member/mail/toggle`, 
			{
				"twoFactor": twoFactor
			});
		};

		instance.get(`${process.env.REACT_APP_BACK_URL}/auth/me`).then((response => {
			myData = response.data; 
		}))

		onClose();
		window.location.reload();
	};

	const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		
		if (file) {
			const isAlphanumeric = /^[a-zA-Z0-9.]+$/.test(file.name);

			if (!isAlphanumeric) {
			  alert("파일 이름은 영어와 숫자로만 이루어져야 합니다.");
			  return;
			}
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
					maxLength={8}
				/>
				<button className="my-info-change-nick-submit" onClick={onReset}>확인</button>
			</div>
			<label className="twofactor-button">
				2차인증 활성화{" "}
				<input
				type="checkbox"
				checked={twoFactor}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setTwoFactor(e.target.checked)}
				/>
			</label>
			<button className="my-info-change-set-button" onClick={handleModifyClick}>수정</button>
		</div>
	)
}

export default MyInfoChange;
