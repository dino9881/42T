import React, { useEffect, useState } from "react";
import instance from "../../refreshToken";
import FriendInfo from "../friendlist/FriendInfo";
import BanList from "../friendlist/BanList";

interface ChannelUserFormProps {
	nickName: string;
}

const ChannelUserForm: React.FC<ChannelUserFormProps> = ({ nickName }) => {
	const [userState, setUserState] = useState(0);
	const [userData, setUserData] = useState<any>(null);

	useEffect(() => {
		instance.get(`${process.env.REACT_APP_BACK_URL}/member/search/${nickName}`)
		.then((response) => {
			// console.log(response.data)
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
				<FriendInfo intraId={userData && userData.intraId} nickName={userData && userData.nickName} rank={userData && userData.rank} avatar={userData && userData.avatar} winCnt={userData && userData.winCnt} loseCnt={userData && userData.loseCnt} state={userState} currstate={userData && userData.status} info={true}/>
			)}
			{userState === 2 && (
				<BanList nickName={userData.nickName} avatar={userData.avatar}/>
			)}
		</div>
	);
}

export default ChannelUserForm