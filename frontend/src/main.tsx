import React from "react";
import Sidebar from "./sidebar/Sidebar";
import Contents from "./Contents";
import Channel from "./Channel";
function Main(){
   
    return <div>
         <Contents mainComponent={<Channel/>}/>
         <Sidebar />
    </div>
    ;
}

export default Main;