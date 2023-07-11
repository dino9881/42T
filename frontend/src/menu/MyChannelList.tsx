import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ChannelProps {
	chIdx: number;
    chName: string;
    // chPwd: number | null;
    chUserCnt: number;
    // isDM: boolean;
    operatorId: string;
	setShowDropDownBox:any;
}

const MyChannelList: React.FC<ChannelProps> = ({chIdx, chName, chUserCnt, operatorId, setShowDropDownBox}) => {
	const navigate = useNavigate();

	const handleIntoChannel = () => {
        setShowDropDownBox(false); // 드롭다운 박스가 사라지도록 상태 변경
        navigate("/chat", { state: { chIdx } });
		window.location.reload();
    }

	return (
		<button className="menu-drop-down-channel-box" onClick={handleIntoChannel}>
			<span className="menu-drop-down-channel-text">{chName}</span>
			<span className="menu-drop-down-channel-text-usercnt">{chUserCnt}/5</span>
		</button>
	)
};

export default MyChannelList