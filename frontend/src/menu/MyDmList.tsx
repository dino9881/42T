import React from "react";
import { useNavigate } from "react-router-dom";

interface DmProps {
	chIdx: number;
    chName: string;
    chUserCnt: number;
	setShowDropDownBox: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyDmList: React.FC<DmProps> = ({chIdx, chName, setShowDropDownBox}) => {
	const navigate = useNavigate();

	const handleIntoChannel = () => {
        setShowDropDownBox(false); // 드롭다운 박스가 사라지도록 상태 변경
        navigate("/dm", { state: { chIdx } });
		window.location.reload();
    }

	return (
		<button className="menu-drop-down-channel-box" onClick={handleIntoChannel}>
			<span className="menu-drop-down-channel-text">{chName}</span>
		</button>
	)
};

export default MyDmList