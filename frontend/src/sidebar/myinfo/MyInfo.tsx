import React, { useState, useEffect } from "react";
import MyInfoChange from "./MyInfoChange";
import InfoScore from "../friendlist/InfoScore";
import instance from "../../refreshToken";
import CheckEmail from "../../login/CheckEmail";
import './MyInfo.css';

const MyInfo = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [showChangeForm, setShowChangeForm] = useState(false);
	const toggleImgSrc = isExpanded ? "toggle_up.svg" : "toggle_down.svg";
	const [myData, setMyData] = useState<any>(null);
	const [isEmail, setEmail] = useState(false);

	useEffect(() => {
		instance.get('http://localhost:5001/auth/me').then((response) => {
			if (myData !== response.data){
				setMyData(response.data); 
			}
		})
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

	const handleEmail = () => {
		setEmail(!isEmail);
		// console.log("onEmail", isEmail);
	}

	return (
		<div className='my-info'>
			<div className='my-info-line'>
				{myData && (
				<div
					className='my-info-avatar'
					style={{ backgroundImage: `url(${myData.avatar})` }}
				></div>
				)}
				<div className='my-info-info'>
				{isExpanded && myData && (
					<InfoScore intraId={myData.intraId} nickName={myData.nickName} rank={myData.rank} state={3} />
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
			{showChangeForm && <CheckEmail myData={myData} onClose={handleCloseForm} onEmail={handleEmail}/>}
			{isEmail && <MyInfoChange myData={myData} onClose={handleEmail} />}
			{/* {showChangeForm && <MyInfoChange myData={myData} onClose={handleEmail} />} */}
		</div>
	);
};

export default MyInfo;