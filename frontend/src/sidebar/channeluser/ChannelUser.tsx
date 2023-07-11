import React, { useEffect } from "react";
import instance from "../../refreshToken";
import { useLocation } from "react-router";

const ChannelUser = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		const idx = localStorage.getItem('chIdx');
		// console.log(idx)
		// instance.get(`http://localhost:5001/channel/user/${idx}`)
		// .then((response) => {
			
		// })
	}, [pathname]);

	return (
		<div>
			{/* <div> */}
				
			{/* </div> */}
		</div>
	);
};

export default ChannelUser;