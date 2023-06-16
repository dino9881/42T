import React, { useState } from "react";
import './MyInfo.css';

interface Myinfo {
	name: string;
	age: number;
	avatarUrl: string;
}

interface MyInfoProps {
	myinfo: Myinfo;
}

const MyScore = () => {
	return (
		<div className="my-score-box">
			<div className="rank">Rank</div>
			<div className="my-score-table">
				<div id="score"> 이름  몇 : 몇</div>
				<div id="score"> 이름  몇 : 몇</div>
				<div id="score"> 이름  몇 : 몇</div>
				<div id="score"> 이름  몇 : 몇</div>
				<div id="score"> 이름  몇 : 몇</div>
			</div>
		</div>
	)
}

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

const MyInfo: React.FC<MyInfoProps> = ({ myinfo }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [showChangeForm, setShowChangeForm] = useState(false);
	const toggleImgSrc = isExpanded ? "toggle_up.svg" : "toggle_down.svg";

	const handleToggle = () => {
		setIsExpanded(!isExpanded);
	};

	const handleModifyClick = () => {
		setShowChangeForm(!showChangeForm);
	}

	const handleCloseForm = () => {
		setShowChangeForm(false);
	}

	return (
		<div className='my-info'>
			<div className='my-info-line'>
				<div className='state-circle'></div>
				<div
					className='my-info-avatar'
					style={{ backgroundImage: `url(${myinfo.avatarUrl})` }}
				></div>
				<div className='my-info-info'>
					{isExpanded && <MyScore />}
					<div className='my-info-text'>
						<div className='small-square'>{myinfo.name}</div>
						<div className='small-square'>{myinfo.age}</div>
					</div>
					<div className='my-info-button'>
						<button className='small-square' onClick={handleModifyClick}>수정</button>
						<div className='small-square'>전적
							<img src={toggleImgSrc} alt="toggle" className="my-toggle-position" onClick={handleToggle}></img>
						</div>
					</div>
				</div>
			</div>
			{showChangeForm && <MyInfoChange onClose={handleCloseForm} />}
		</div>
	);
};

export default MyInfo;
