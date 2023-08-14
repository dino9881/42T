import React , { useState, useEffect } from "react";
import './Ranking.css';
import instance from "../refreshToken";
import RankList from "./RankList";

const Ranking = () => {
	return (
		<div>
        	<RankingComponent></RankingComponent>
    	</div>
	);
};

interface RankData{
	intraId: string,
	  nickName: string,
	  avatar: string,
	  rank: number,
  }

const RankingComponent = () => {
	const [ranking, setRanking] = useState<RankData[]>([]);
	useEffect(() => {
		instance
			.get(`${process.env.REACT_APP_BACK_URL}/member/rank`)
			.then((response) => {
				setRanking(response.data.data);
			})
			.catch((error) => {
				console.log(error.response.status);
				if(error.response.status === 409)
					alert("같은 제목의 방이 이미 있습니다.");
				else if (error.response.status === 400)
					alert("입력정보가 잘못되었습니다(bad request).");
				else if(error.response.status === 404)
					alert("멤버가 아님...;;");    
				else if(error.response.status === 500)
					alert("서버에러 (뺵 잘못)");
			});
	}, []);
		return (
			<div className="ranking">
				<RankList ranking={ranking && ranking.slice(0, 7)}></RankList>
					<div className="ranking-123rk">
						<div className="ranking-2rk">
							{ranking.length > 1 && ranking[1]?.rank > 100 && ( <>
							<img src={ranking[1].avatar} alt="2위 사진"/>
							<div className="ranking-2rk_namerankbox">
								{ranking[1].nickName}
							</div>
							<div className="ranking-2rk_box">2 위</div>
							</>)}
						</div>
						<div className="ranking-1rk">
							{ranking && ranking[0]?.rank > 100 && ( <>
							<img src={ranking[0].avatar} alt="1위 사진"/>
							<div className="ranking-1rk_namerankbox">
								{ranking[0].nickName}
							</div>
							<div className="ranking-1rk_box">1 위</div>
							</>)}
						</div>
						<div className = "ranking-3rk">
							{ranking.length > 2 && ranking[2]?.rank > 100 ? ( 
							<>
								<img src={ranking[2].avatar} alt="3위 사진"/>
								<div className="ranking-3rk_namerankbox">
									{ranking[2].nickName}
								</div>
							</>
							)
							: (
								<>
								<div className="ranking-3rk_emptyimg"/>
								<div className="ranking-3rk_emptyrank"/>
							</>)}
							{ranking.length > 1  && ( 
							<>
								<div className="ranking-3rk_box">3 위</div>
							</>)}
						</div>
					</div>
				</div>
			)
		}


export default Ranking;
