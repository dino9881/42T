import React from "react";
import './Ranking.css';


interface RankData{
  intraId: string,
    nickName: string,
    avatar: string,
    rank: number,

}

function RankList(props: { ranking: RankData[] }) {
  const { ranking } = props;
  
  const extendedRanking = [...ranking, ...Array.from({ length: 7 - ranking.length }, () => null)];

  let currentRank = 1; 
  let prevScore: number | null = null; 
  let addRankText= "";


  return (
    <div className="ranking-etc">
      <div className="ranking-etc_titlebox">
        <div>분노의 핑 투더 퐁</div>
        <div className="ranking-etc_titlebox_result">순위 발표</div>
      </div>
      <div className="ranking-etc_ranklist">
      {extendedRanking.map((rank: RankData | null, index: number) => {
          if (rank === null || (rank.rank && rank.rank === 100)) {
            return <div key={index} className="ranking-etc_emptyrank"></div>;
          }

          let rankText = ""; 

          if (prevScore !== null && rank.rank !== prevScore) {
            currentRank = index + 1;
          }

          rankText = `${currentRank}위`; 
          prevScore = rank.rank;

          if(rankText === "1위")
            addRankText = "_1st";
          else if(rankText === "2위")
            addRankText = "_2nd";
          else if(rankText === "3위")
            addRankText = "_3rd";
          else
            addRankText = "";

            console.log(`ranking-etc_ranktext${addRankText}`);

          return (
            <div key={index} className="ranking-etc_rank">
              <div className={`ranking-etc_ranktext${addRankText}`}>{rankText}</div>
              <img className={`ranking-etc_rank_avatar${addRankText}`} src={rank.avatar} alt={`${currentRank}위 아바타사진`} />
              <div className="ranking-etc_namebox">
                <div>닉넴: {rank.nickName}</div>
                <div>승점: {rank.rank}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RankList;