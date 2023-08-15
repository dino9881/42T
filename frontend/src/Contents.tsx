import React, { useEffect } from "react";
import Sidebar from "./sidebar/Sidebar";
import instance from "./refreshToken";
import { socket } from "./socket";

interface ContentsProps {
  headerComponent: React.ReactNode;
  mainComponent: React.ReactNode;
}

function Contents ({mainComponent, headerComponent} : ContentsProps) {
          instance.get(`${process.env.REACT_APP_BACK_URL}/auth/me`).then((response) => {
            socket.emit("member-info", response.data);
            // console.log("member-info emit");
            });

          useEffect(() => {

            socket.on("invite", (intraId: string, chanName: string) => {
              alert(intraId + " 님이 " + chanName + "에 초대하셨습니다.")
            });

            socket.on("send-dm", (intraId: string) => {
              alert(intraId + " 님이 DM 을 보냈습니다.");
            });
  
          return () => {
              socket.off("invite");
              socket.off("send-dm");
            };
  
          }, []);
  
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