import React from "react";
import './Ranking.css';


interface RankData{
  intraId: string,
    nickName: string,
    avatar: string,
    rank: number,
    // winCnt: number,
    // loseCnt: number,
    // currentRefreshToken: string,
    // currentRefreshTokenExp: string,
    // isFriend: boolean,
    // isBan: boolean,
    // code: number,
}

// function RankList(props: { ranking: RankData[]}) {
//     const { ranking } = props;
    
//     const extendedRanking = [...ranking, ...Array.from({ length: 7 - ranking.length }, () => null)];
//                               // ...은 배열의 확장시 사용됨 (객체확장)
//     return (
//         <div className="ranking-etc">
//       <div className="ranking-etc_titlebox">
//         <div>트센 분노의 핑 투더 퐁</div>
//         <div>순위 발표</div>
//       </div>
//       <div className="ranking-etc_ranklist">
//       {extendedRanking.map((rank: RankData | null, index: number) => {
//           if (rank) {
//             return (
//               <div key={index} className="ranking-etc_rank">
//                 <img src="" alt={`${index + 1}위 로고? 그림`} />
//                 <img src={rank.avatar} alt={`${index + 1}위 아바타사진`} />
//                 <div>닉넴: {rank.nickName}  </div>
//                 <div>승점: {rank.rank} !</div>
//               </div>
//             );
//           } else {
//             return (
//               <div key={index} className="ranking-etc_emptyrank"></div>
//             );
//           }
//         })}
//       </div>
//     </div>
//   );
// }

// let currentRank = 1; // 현재 순위
//   let prevScore = null; // 이전 점수

//   return (
//     <div className="ranking-etc">
//       <div className="ranking-etc_titlebox">
//         <div>트센 분노의 핑 투더 퐁</div>
//         <div>순위 발표</div>
//       </div>
//       <div className="ranking-etc_ranklist">
//         {ranking.map((rank: RankData | null, index: number) => {
//           if (rank === null) {
//             return <div key={index} className="ranking-etc_emptyrank"></div>;
//           }

//           let rankText = ""; // 등수를 표시할 문자열

//           if (prevScore !== null && rank.rank !== prevScore) {
//             currentRank = index + 1;
//           }

//           rankText = `${currentRank}위!!`;
//           prevScore = rank.rank;

//           return (
//             <div key={index} className="ranking-etc_rank">
//               <div>{rankText}</div>
//               <img src="" alt={`${currentRank}위 로고? 그림`} />
//               <img src={rank.avatar} alt={`${currentRank}위 아바타사진`} />
//               <div>닉넴: {rank.nickName}</div>
//               <div>승점: {rank.rank}!</div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default RankList;

// function RankList(props: { ranking: RankData[] }) {
//   const { ranking } = props;
  
//   let currentRank = 1; // 현재 순위
//   let prevScore: number | null = null; // 이전 점수

//   return (
//     <div className="ranking-etc">
//       <div className="ranking-etc_titlebox">
//         <div>트센 분노의 핑 투더 퐁</div>
//         <div>순위 발표</div>
//       </div>
//       <div className="ranking-etc_ranklist">
//         {ranking.map((rank: RankData | null, index: number) => {
//           if (rank === null) {
//             return <div key={index} className="ranking-etc_emptyrank"></div>;
//           }

//           let rankText = ""; // 등수를 표시할 문자열

//           if (prevScore !== null && rank.rank !== prevScore) {
//             currentRank = index + 1;
//           }

//           rankText = `${currentRank}위!!`;
//           prevScore = rank.rank;

//           return (
//             <div key={index} className="ranking-etc_rank">
//               <div>{rankText}</div>
//               <img src="" alt={`${currentRank}위 로고? 그림`} />
//               <img src={rank.avatar} alt={`${currentRank}위 아바타사진`} />
//               <div>닉넴: {rank.nickName}</div>
//               <div>승점: {rank.rank}!</div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

function RankList(props: { ranking: RankData[] }) {
  const { ranking } = props;
  
  const extendedRanking = [...ranking, ...Array.from({ length: 7 - ranking.length }, () => null)];

  let currentRank = 1; // 현재 순위
  let prevScore: number | null = null; // 이전 점수

  return (
    <div className="ranking-etc">
      <div className="ranking-etc_titlebox">
        <div>트센 분노의 핑 투더 퐁</div>
        <div>순위 발표</div>
      </div>
      <div className="ranking-etc_ranklist">
      {extendedRanking.map((rank: RankData | null, index: number) => {
          if (rank === null || (rank.rank && rank.rank === 100)) {
            return <div key={index} className="ranking-etc_emptyrank"></div>;
          }

          let rankText = ""; // 등수를 표시할 문자열

          if (prevScore !== null && rank.rank !== prevScore) {
            currentRank = index + 1;
          }

          rankText = `${currentRank}위`; 
          prevScore = rank.rank;

          return (
            <div key={index} className="ranking-etc_rank">
              <div>{rankText}</div>
              <img src="" alt={`${currentRank}위 로고? 그림`} />
              <img src={rank.avatar} alt={`${currentRank}위 아바타사진`} />
              <div className="ranking-etc_namebox">
                <div>닉넴: {rank.nickName}</div>
                <div>승점: {rank.rank}!</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RankList;