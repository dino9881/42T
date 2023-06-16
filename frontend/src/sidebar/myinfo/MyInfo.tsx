import React, { useState } from "react";
import './MyInfo.css';
import MyInfoChange from "./MyInfoChange";
import InfoScore from "../friendlist/InfoScore";

interface Myinfo {
	name: string;
	age: number;
	avatarUrl: string;
}

interface MyInfoProps {
	myinfo: Myinfo;
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
					{/* {isExpanded && <MyScore />} */}
					{isExpanded && <InfoScore name={myinfo.name} age={myinfo.age} avatarUrl={myinfo.avatarUrl} state={1} />}
					
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
