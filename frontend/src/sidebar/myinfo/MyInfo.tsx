import React, { useState, useEffect } from "react";
import axios from 'axios';
import MyInfoChange from "./MyInfoChange";
import InfoScore from "../friendlist/InfoScore";
import setAuthorizationToken from "../../setAuthorizationToken";
import './MyInfo.css';

const MyInfo = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [showChangeForm, setShowChangeForm] = useState(false);
	const toggleImgSrc = isExpanded ? "toggle_up.svg" : "toggle_down.svg";
	const [myData, setMyData] = useState<any>(null)

	useEffect(() => {
		
		// axios.post("http://localhost:5001/auth/refresh").then((res) => {
		// 	console.log(res.data);
		axios.get('http://localhost:5001/auth/me').then((response) => {
			// console.log(response);
				if (myData !== response.data){
					setMyData(response.data); 
				}
			})
		// });
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
					<InfoScore intraId={myData.intraId} nickName={myData.nickName} rank={myData.rank} state={1} />
				)}
				<div className='my-info-text'>
					<div className='small-square'>{myData && myData.nickName}</div>
					<div className='small-square'>{myData && myData.rank}</div>
				</div>
				<div className='my-info-button'>
					<button className='small-square' onClick={handleModifyClick}>수정</button>
					<div className='small-square'>
						<span style={{color: "blue"}}>{myData && myData.winCnt}</span>
						/
						 <span style={{color: "red"}}>{myData && myData.loseCnt}</span>
					<img src={toggleImgSrc} alt="toggle" className="my-toggle-position" onClick={handleToggle} style={{ cursor: 'pointer' }}></img>
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
