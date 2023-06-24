import React from "react";
import Contents from "../Contents";
import Sidebar from "../sidebar/Sidebar";
import Menu from "../menu/Menu";
// import 'Ranking.css';

const Ranking = () => {
	return (
		<div>
        	<Contents headerComponent={<Menu showBackButton={true}/>} mainComponent={<RankingComponent/>}/>
       		<Sidebar />
    	</div>
	);
};

const RankingComponent = () => {
	return (
		<div>
			
		</div>
	)
}

export default Ranking