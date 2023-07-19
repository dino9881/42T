import React from "react";
import { useNavigate } from "react-router-dom";

interface ChannelProps {
	chIdx: number;
    chName: string;
    chUserCnt: number;
	setShowDropDownBox:any;
	isPrivate: boolean;
}

const MyChannelList: React.FC<ChannelProps> = ({chIdx, chName, chUserCnt, setShowDropDownBox, isPrivate}) => {
	const navigate = useNavigate();

	const handleIntoChannel = () => {
        setShowDropDownBox(false); // 드롭다운 박스가 사라지도록 상태 변경
        navigate("/chat", { state: { chIdx } });
		window.location.reload();
    }

	return (
		<button className="menu-drop-down-channel-box" onClick={handleIntoChannel}>
			<span className="menu-drop-down-channel-text">{chName}</span>
			{!isPrivate && <span className="menu-drop-down-channel-text-usercnt">{chUserCnt}/5</span>}
		</button>
	)
};

export default MyChannelList