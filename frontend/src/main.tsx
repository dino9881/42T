import React from "react";
import Sidebar from "./sidebar/Sidebar";
import Contents from "./Contents";
<<<<<<< HEAD
import Channel from "./Channel";
=======
import Channel from "./channel/Channel";
>>>>>>> channel
import Menu from "./menu/Menu";
function Main(){
   
    return <div>
         <Contents headerComponent={<Menu showBackButton={false}/>} mainComponent={<Channel/>}/>
         <Sidebar />
    </div>
    ;
}

export default Main;