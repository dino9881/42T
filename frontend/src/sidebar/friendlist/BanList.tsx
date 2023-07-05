import React from "react";
import axios from "axios";

const BanList = () => {
	const test:any = {
		avatar: "/avatar/kim.jpeg",
		nickName: "testban"
	}

	function getBanList() {
		// axios.delete(`http://localhost:5001/member/unban/${test.nickName}`).then((response) => {
		// 	window.location.reload();
		// });
		console.log("차단해제")
	}

	return (
		<div className="friend-info-line-ban friend-ban-list">
			<div
				className='friend-info-avatar-ban'
				style={{ backgroundImage: `url(${test.avatar})` }}
			></div>
			<div className='small-square-ban'>{test.nickName}</div>
			<button className='ban-cancle-button' onClick={getBanList}>차단 해제</button>
		</div>
	)
};

export default BanList