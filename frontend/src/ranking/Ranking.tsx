import React , { useState } from "react";
import Contents from "../Contents";
import Sidebar from "../sidebar/Sidebar";
import Menu from "../menu/Menu";
import './Ranking.css';
import axios from "axios";

const Ranking = () => {
	return (
		<div>
        	<Contents headerComponent={<Menu showBackButton={true}/>} mainComponent={<RankingComponent/>}/>
       		<Sidebar />
    	</div>
	);
};



const RankingComponent = () => {
	const [ranking, setRanking] = useState([]);
	axios
		.get("http://localhost:5001/member/all")
		.then((response) => (setRanking(response.data)))
			
		.catch((error) => {
			console.log(error.response.status);
			if(error.response.status === 409)
				alert("같은 제목의 방이 이미 있습니다.");
			else if (error.response.status === 400)
				alert("입력정보가 잘못되었습니다(bad request).");
			else if (error.response.status === 400)
				alert("입력정보가 잘못되었습니다(bad request).");
			else if(error.response.status === 404)
				alert("멤버가 아님...;;");    
			else if(error.response.status === 500)
				alert("서버에러 (뺵 잘못)");
		});
	
	return (
		<div className="ranking">
			<div className="ranking-123rk">
				<div className="ranking-2rk">
					<div className="ranking-2rk_user">heeskim</div>
					<div className="ranking-2rk_box">2위</div>	
				</div>
				<div className="ranking-1rk">
					<div className="ranking-1rk_user">junhyuki</div>
					<div className="ranking-1rk_box">1위</div>
				</div>
				<div className="ranking-3rk">
					<div className="ranking-3rk_user">yyoo</div>
					<div className="ranking-3rk_box">3위</div>
				</div>
				<div className="ranking-etc">
					<div className="ranking-etc_titlebox">
						<div>트센 분노의 핑 투더 퐁</div>
						<div> 순위 발표 </div>
					</div>
					<div className="ranking-etc_ranklist">
						<div className="ranking-1st">
							<img src="" alt="1위 로고? 그림" />
							<img src="" alt="1위 아바타사진" />
							<div>점수</div>
						</div>
						<div className="ranking-2nd">
							<img src="" alt="2위 로고? 그림" />
							<img src="" alt="2위 아바타사진" />
							<div>점수</div>
						</div>
						<div className="ranking-3rd">
							<img src="" alt="3위 로고? 그림" />
							<img src="" alt="3위 아바타사진" />
							<div>점수</div>
						</div>
						<div className="ranking-4th">
							<img src="" alt="4위 로고? 그림" />
							<img src="" alt="4위 아바타사진" />
							<div>점수</div>
						</div>
						<div className="ranking-5th">
							<img src="" alt="5위 로고? 그림" />
							<img src="" alt="5위 아바타사진" />
							<div>점수</div>
						</div>
						<div className="ranking-6th">
							<img src="" alt="6위 로고? 그림" />
							<img src="" alt="6위 아바타사진" />
							<div>점수</div>
						</div>
						<div className="ranking-7th">
							<img src="" alt="7위 로고? 그림" />
							<img src="" alt="7위 아바타사진" />
							<div>점수</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Ranking
