import React, { useState } from "react";
import FriendInfoSimple from "./FriendInfoSimple";
import InfoScore from "./InfoScore";
import './FriendInfo.css';

interface FriendInfoProps {
	intraId: string;
	nickName: string;
	rank: number;
	avatar: string;
	loseCnt: number;
	winCnt: number;
}

<<<<<<< HEAD
const FriendInfo: React.FC<FriendInfoProps> = ({ intraId, nickName, rank, avatar, winCnt, loseCnt }) => {
=======
const FriendInfo: React.FC<FriendInfoProps> = ({intraId, nickName, rank, avatar }) => {
>>>>>>> socket-chat
	const [isExpanded, setIsExpanded] = useState(false);
	const [toggleImgSrc, setToggleImgSrc] = useState("toggle_down.svg");

	const handleToggle = () => {
	  setIsExpanded(!isExpanded);
	  setToggleImgSrc(isExpanded ? "toggle_down.svg" : "toggle_up.svg");
	};

	return (
		<div>
			<div className={isExpanded ? 'friend-info-line-big' : 'friend-info-line-small'}>
<<<<<<< HEAD
				<FriendInfoSimple nickName={nickName} rank={rank} avatar={avatar} winCnt={winCnt} loseCnt={loseCnt}/>
=======
				<FriendInfoSimple nickName={nickName} rank={rank} avatar={avatar}/>
>>>>>>> socket-chat
				<img src={toggleImgSrc} alt="toggle" className="friend-toggle-down" onClick={handleToggle} style={{ cursor: 'pointer' }}></img>
				{isExpanded && <InfoScore intraId={intraId} nickName={nickName} rank={rank} state={2} />}
			</div>
		</div>
	);
}

export default FriendInfo;