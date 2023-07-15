import React, { useEffect, useState } from "react";
import instance from "../../refreshToken";
import FriendInfo from "../friendlist/FriendInfo";
import BanList from "../friendlist/BanList";

interface ChannelUserFormProps {
	// intraId: string;
	nickName: string;
}

const ChannelUserForm: React.FC<ChannelUserFormProps> = ({ nickName }) => {
	const [userState, setUserState] = useState(0);		// friend = 1, ban = 2, other = 0, me = 3
	const [userData, setUserData] = useState<any>(null);

	useEffect(() => {
		instance.get(`http://localhost:5001/member/search/${nickName}`)
		.then((response) => {
			console.log(response.data)
			if (response.data.isFriend === true) {
				setUserState(1);
			}
			else if (response.data.isBan === true) {
				setUserState(2);
			}else {
				setUserState(0);
			}
			setUserData(response.data);
		})
	}, []);

	return (
		<div>
			{userState !== 2 && (
				<FriendInfo intraId={userData && userData.intraId} nickName={userData && userData.nickName} rank={userData && userData.rank} avatar={userData && userData.avatar} winCnt={userData && userData.winCnt} loseCnt={userData && userData.loseCnt} state={userState} currstate={userData && userData.status}/>
			)}
			{userState === 2 && (
				<BanList nickName={userData.nickName} avatar={userData.avatar}/>
			)}
		</div>
	);
}

export default ChannelUserForm