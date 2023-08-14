import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import instance from "../../refreshToken";
import ChannelUserForm from "./ChannelUserForm";

interface User {
	intraId: string;
	nickName: string;
}

const ChannelUser = () => {
	const { pathname } = useLocation();
	const [usersList, setUsersList] = useState<User[]>([]);
	const [isCurrentChannel, setIsCurrentChannel] = useState(true);

	useEffect(() => {
		const idx = localStorage.getItem('chIdx');
		if (idx === "0") {
			setIsCurrentChannel(false);
			return;
		}
		instance.get(`http://localhost:5001/channel/${idx}`)
		.then((response) => {
			if(response.data.isDM === false) {
				instance.get(`http://localhost:5001/channel/users/${idx}`)
				.then((response) => {
					setUsersList(response.data);
				})
				.catch((error) => {
					console.log(error)
				})
			}
		})
		.catch((error) => {
			
		})
	}, [pathname]);

	return (
		<div className="list-scroll">
			{!isCurrentChannel ? (
				<div>현재 채팅 채널이 아닙니다.</div>
			) : (
				usersList.map((usersList, index) => (
					<ChannelUserForm key={index} nickName={usersList.nickName}/>
				))
			)}
		</div>
	);
};

export default ChannelUser;