import React from "react";
import './Ranking.css';


interface RankData{
  intraId: string,
    nickName: string,
    avatar: string,
    rank: number,
    winCnt: number,
    loseCnt: number,
    currentRefreshToken: string,
    currentRefreshTokenExp: string,
    isFriend: boolean,
    isBan: boolean,
    code: number,
}

function RankList(props: { ranking: RankData[]}) {
    const { ranking } = props;
    
    // const extendedRanking = ranking.concat(Array.from({ length: 7 - ranking.length }, () => null));

    return (
        <div className="ranking-etc">
      <div className="ranking-etc_titlebox">
        <div>트센 분노의 핑 투더 퐁</div>
        <div>순위 발표</div>
      </div>
      <div className="ranking-etc_ranklist">
        {ranking.map((rank: any, index:any) => {
          if (rank) {
            return (
              <div key={index} className="ranking-etc_rank">
                <img src="" alt={`${index + 1}위 로고? 그림`} />
                <img src={rank.avatar} alt={`${index + 1}위 아바타사진`} />
                <div>승점: {rank.rank} !</div>
              </div>
            );
          } else {
            return (
              <div key={index} className="ranking-etc_emptybox"></div>
            );
          }
        })}
      </div>
    </div>
  );
}


export default RankList;
