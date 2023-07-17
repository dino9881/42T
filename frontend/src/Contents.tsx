import React from "react";
import Sidebar from "./sidebar/Sidebar";
import instance from "./refreshToken";
import { socket } from "./socket";

interface ContentsProps {
  headerComponent: React.ReactNode;
  mainComponent: React.ReactNode;
}

function Contents ({mainComponent, headerComponent} : ContentsProps) {
          instance.get('http://localhost:5001/auth/me').then((response) => {
            socket.emit("member-info", response.data);
            // console.log("member-info emit");
            });
          return <div>
          <div className="contents">
          <div className="contents-header"> {headerComponent}</div>
          <div className="contents-main">
          {mainComponent}
         </div>
          </div>
          <Sidebar/>
    </div>
  ;
}

export default Contents;