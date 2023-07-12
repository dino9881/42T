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

const RankingComponent = () => {
	const [ranking, setRanking] = useState<any[]>([]);
	useEffect(() => {
		instance
			.get("http://localhost:5001/member/rank")
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
			<div className="ranking-123rk">
				<div className="ranking-2rk">
					{ranking && ranking[1] && ( <>
					<img src={ranking[1].avatar} alt="2위 사진"/>
					<div className="ranking-2rk_user">{ranking[1].intraId}</div>
					<div className="ranking-2rk_box">2위</div>	
					</>)}
				</div>
				<div className="ranking-1rk">
					{ranking && ranking[0] && ( <>
					<img src={ranking[0].avatar} alt="1위 사진"/>
					<div className="ranking-1rk_user">{ranking[0].intraId}</div>
					<div className="ranking-1rk_box">1위</div>
					</>)}
				</div>
				<div className="ranking-3rk">
					{ranking && ranking[2] && ( <>
					<img src={ranking[2].avatar} alt="3위 사진"/>
					<div className="ranking-3rk_user">{ranking[2].intraId}</div>
					<div className="ranking-3rk_box">3위</div>
					</>)}
				</div>
			<RankList ranking={ranking && ranking.slice(0, 7)}></RankList>
			</div>
		</div>
	)
}

export default Ranking
