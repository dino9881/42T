import React, { useEffect, useState } from "react";
import instance from "../../refreshToken";

interface ChannelUserFormProps {
	intraId: string;
	// nickName: string;
}

const ChannelUserForm: React.FC<ChannelUserFormProps> = ({ intraId }) => {
	const [userState, setUserState] = useState(0);

	useEffect(() => {
		instance.get(`http://localhost:5001/member/${intraId}`)
		.then((response) => {
			console.log(response)
			// if (response.data.)
		})
	}, []);

	// function userStateFun() {
	// 	instance.get(`http://localhost:5001/member/${intraId}`)
	// 	.then((response) => {
	// 		console.log(response)
	// 	})
	// };

	return (
		<div>

		</div>
	);
}

export default ChannelUserForm