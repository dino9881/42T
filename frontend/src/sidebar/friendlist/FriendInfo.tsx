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

const FriendInfo: React.FC<FriendInfoProps> = ({ intraId, nickName, rank, avatar, winCnt, loseCnt }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [toggleImgSrc, setToggleImgSrc] = useState("toggle_down.svg");

	const handleToggle = () => {
	  setIsExpanded(!isExpanded);
	  setToggleImgSrc(isExpanded ? "toggle_down.svg" : "toggle_up.svg");
	};

	return (
		<div>
			<div className={isExpanded ? 'friend-info-line-big' : 'friend-info-line-small'}>
				<FriendInfoSimple nickName={nickName} rank={rank} avatar={avatar} winCnt={winCnt} loseCnt={loseCnt}/>
				<img src={toggleImgSrc} alt="toggle" className="friend-toggle-down" onClick={handleToggle} style={{ cursor: 'pointer' }}></img>
				{isExpanded && <InfoScore intraId={intraId} nickName={nickName} rank={rank} state={2} />}
			</div>
		</div>
	);
}

export default FriendInfo;