import React, { useState } from "react";
import './MyInfo.css';

const MyInfoChange = ({ onClose }: { onClose: () => void }) => {
	const [avatarUrl, setAvatarUrl] = useState("avatar/yyoo.jpeg");

	const handleAvatarButtonClick = (newAvatarUrl: string) => {
		setAvatarUrl(newAvatarUrl);
	};

	return (
		<div className="my-info-change">
			<img className="my-info-change-close" src="close_button.svg" alt="Close" onClick={onClose} width={28} height={28}/>
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
				<div>nick</div>
					<input type="text" />
					<button type="submit">로그인</button>
			</div>
		</div>
	)
}

export default MyInfoChange;
