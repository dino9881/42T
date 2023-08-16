import React from "react";
import instance from "../../refreshToken";

interface BanProps {
	nickName: string;
	avatar: string;
}

const BanList: React.FC<BanProps> = ({nickName, avatar}) => {
	function getBanList() {
		instance.delete(`${process.env.REACT_APP_BACK_URL}/member/ban/delete/${nickName}`).then(() => {
			window.location.reload();
			// console.log("차단해제")
		});
	}

	return (
		<div className="friend-info-line-ban friend-ban-list">
			<div
				className='friend-info-avatar-ban'
				style={{ backgroundImage: `url(${avatar})` }}
			></div>
			<div className='small-square-ban'>{nickName}</div>
			<button className='ban-cancle-button' onClick={getBanList}>차단 해제</button>
		</div>
	)
};

export default BanList