import React from "react";
import Sidebar from "./sidebar/Sidebar";
import Contents from "./Contents";
import Channel from "./Channel";
import Menu from "./menu/Menu";
function Main(){
   
    return <div>
         <Contents headerComponent={<Menu showBackButton={true}/>} mainComponent={<Channel/>}/>
         <Sidebar />
    </div>
    ;
}

export default Main;