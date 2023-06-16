import React, { useState } from "react";
import './FriendInfo.css';
import FriendInfoSimple from "./FriendInfoSimple";
import InfoScore from "./InfoScore";

interface FriendInfoProps {
	name: string;
	age: number;
	avatarUrl: string;
}

const FriendInfo: React.FC<FriendInfoProps> = ({ name, age, avatarUrl }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [toggleImgSrc, setToggleImgSrc] = useState("toggle_down.svg");

	const handleToggle = () => {
	  setIsExpanded(!isExpanded);
	  setToggleImgSrc(isExpanded ? "toggle_down.svg" : "toggle_up.svg");
	};

	return (
		<div>
			<div className={isExpanded ? 'friend-info-line-big' : 'friend-info-line-small'}>
				<FriendInfoSimple name={name} age={age} avatarUrl={avatarUrl}/>
				<img src={toggleImgSrc} alt="toggle" className="friend-toggle-down" onClick={handleToggle}></img>
				{isExpanded && <InfoScore name={name} age={age} avatarUrl={avatarUrl} state={2} />}
			</div>
		</div>
	);
}

export default FriendInfo;