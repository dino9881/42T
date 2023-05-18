import React from "react";
import './MyInfo.css';

const MyInfo = () => {
	return (
		<div className='my-info'>
			<div className='my-info-line'>
				<div className='state-circle'></div>
				<div className='my-info-avatar'></div>
				<div className='my-info-info'>
					<div className='my-info-text'>
						<div className='small-square'>nick</div>
						<div className='small-square'>LANK</div>
					</div>
					<div className='my-info-button'>
						<button className='small-square'>수정</button>
						<div className='with-triangle'>
							<button className='small-square'>전적</button>
							<button className='inverted-triangle'>삼</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MyInfo;