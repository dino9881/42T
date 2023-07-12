import React, { useEffect, useState } from "react";
import instance from "../../refreshToken";
import { useLocation } from "react-router";
import ChannelUserForm from "./ChannelUserForm";

interface User {
	intraId: string;
	nickName: string;
}
  
interface UserListProps {
	Users: User[];
}

const ChannelUser = () => {
	const { pathname } = useLocation();
	const [usersList, setUsersList] = useState<User[]>([]);

	useEffect(() => {
		const idx = localStorage.getItem('chIdx');
		instance.get(`http://localhost:5001/channel/users/${idx}`)
		.then((response) => {
			// console.log(response);
			setUsersList(response.data);
		})
	}, [pathname]);

	return (
		<div>
			{usersList && usersList.map((usersList, index) => (
				<ChannelUserForm key={index} intraId={usersList.intraId}/>
     	 	))}
		</div>
	);
};

export default ChannelUser;