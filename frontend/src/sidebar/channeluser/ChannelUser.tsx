import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import instance from "../../refreshToken";
import ChannelUserForm from "./ChannelUserForm";
import { error } from "console";

interface User {
	intraId: string;
	nickName: string;
}

const ChannelUser = () => {
	const { pathname } = useLocation();
	const [usersList, setUsersList] = useState<User[]>([]);

	useEffect(() => {
		const idx = localStorage.getItem('chIdx');
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
			{usersList && usersList.map((usersList, index) => (
				<ChannelUserForm key={index} nickName={usersList.nickName}/>
		))}
		</div>
	);
};

export default ChannelUser;