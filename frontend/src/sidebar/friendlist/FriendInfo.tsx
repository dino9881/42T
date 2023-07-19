import React, { useState } from "react";
import FriendInfoSimple from "./FriendInfoSimple";
import InfoScore from "./InfoScore";
import Custom from "../../custom/Custom";
import './FriendInfo.css';

interface FriendInfoProps {
	intraId: string;
	nickName: string;
	rank: number;
	avatar: string;
	loseCnt: number;
	winCnt: number;
	state: number;	// 친구 or 벤 or 둘 다 아님
	currstate: number;	// 현재 상태
	info: boolean;
}

const FriendInfo: React.FC<FriendInfoProps> = ({ intraId, nickName, rank, avatar, winCnt, loseCnt, state, currstate, info }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [toggleImgSrc, setToggleImgSrc] = useState("toggle_down.svg");
	const [isCustomOpen, setIsCustomOpen] = useState(false);

	const handleToggle = () => {
		setIsExpanded(!isExpanded);
		setToggleImgSrc(isExpanded ? "toggle_down.svg" : "toggle_up.svg");
	};

		
	const handleCloseCustom = () => {
		setIsCustomOpen(false);
	};

	return (
		<div>
			<div className={isExpanded ? 'friend-info-line-big' : 'friend-info-line-small'}>
				<FriendInfoSimple intraId={intraId} nickName={nickName} rank={rank} avatar={avatar} winCnt={winCnt} loseCnt={loseCnt} currstate={currstate} state={state} setIsCustomOpen={setIsCustomOpen}/>
				{info && <img src={toggleImgSrc} alt="toggle" className="friend-toggle-down" onClick={handleToggle} style={{ cursor: 'pointer' }}></img>}
				{info && isExpanded && <InfoScore intraId={intraId} nickName={nickName} rank={rank} state={state} />}
			</div>
			{isCustomOpen && <Custom nickName={nickName} onClose={handleCloseCustom} />}
		</div>
	);
}

export default FriendInfo;