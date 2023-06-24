import React, { useState, useEffect } from "react";
import axios from 'axios';
import MyInfoChange from "./MyInfoChange";
import InfoScore from "../friendlist/InfoScore";
import './MyInfo.css';

const MyInfo = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [showChangeForm, setShowChangeForm] = useState(false);
	const toggleImgSrc = isExpanded ? "toggle_up.svg" : "toggle_down.svg";
	const [myData, setMyData] = useState<any>(null)

	// axios.post('http://localhost:5001/member/create', 
	// {
	// 	"intraId": "heeskim",
	// 	"nickName": "hees",
	// 	"avatar": "img/avatar.jpg",
	// 	"rank": 100
	// }
	// )
	// .then(function (response) {
	// 	console.log(response);
	// })
	// .catch(function (error) {
	// 	console.log(error);
	// });
	
	useEffect(() => {
		axios.get('http://localhost:5001/member/heeskim')
		.then((response) => {
			setMyData(response.data);
			// console.log(response.data); // 데이터 출력
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);


	const handleToggle = () => {
		setIsExpanded(!isExpanded);
	};

	const handleModifyClick = () => {
		setShowChangeForm(!showChangeForm);
	}

	const handleCloseForm = () => {
		setShowChangeForm(false);
	}

	return (
		<div className='my-info'>
			<div className='my-info-line'>
				<div className='state-circle'></div>
				{myData && (
				<div
					className='my-info-avatar'
					style={{ backgroundImage: `url(${myData.avatar})` }}
				></div>
				)}
				<div className='my-info-info'>
				{isExpanded && myData && (
					<InfoScore name={myData.nickName} rank={myData.rank} avatar={myData.avatar} state={1} />
				)}
				<div className='my-info-text'>
					<div className='small-square'>{myData && myData.nickName}</div>
					<div className='small-square'>{myData && myData.rank}</div>
				</div>
				<div className='my-info-button'>
					<button className='small-square' onClick={handleModifyClick}>수정</button>
					<div className='small-square'>전적
					<img src={toggleImgSrc} alt="toggle" className="my-toggle-position" onClick={handleToggle}></img>
					</div>
				</div>
				</div>
			</div>
			{/* {showChangeForm && <MyInfoChange onClose={handleCloseForm} avatar={myData && myData.avatar} nickName={myData && myData.nickName} />} */}
			{showChangeForm && <MyInfoChange onClose={handleCloseForm} myData={myData} />}
		</div>
	);
};

export default MyInfo;
