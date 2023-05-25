import React from "react";
import './MyInfo.css';

interface Myinfo {
	name: string;
	age: number;
	avatarUrl: string;
}
  
interface MyInfoProps {
	myinfo: Myinfo;
}
  
const MyInfo: React.FC<MyInfoProps> = ({ myinfo }) => {
	return (
		<div className='my-info'>
			<div className='my-info-line'>
				<div className='state-circle'></div>
				<div className='my-info-avatar'
					style={{ backgroundImage: `url(${myinfo.avatarUrl})` }}
				></div>
				<div className='my-info-info'>
					<div className='my-info-text'>
						<div className='small-square'>{myinfo.name}</div>
						<div className='small-square'>{myinfo.age}</div>
					</div>
					<div className='my-info-button'>
						<button className='small-square'>수정</button>
						<div className='small-square'>전적
						<img src="toggle_down.svg" alt="toggle" className="my-toggle-position"></img></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MyInfo;