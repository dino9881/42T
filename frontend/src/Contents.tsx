import React from "react";
import Sidebar from "./sidebar/Sidebar";

interface ContentsProps {
  headerComponent: React.ReactNode;
  mainComponent: React.ReactNode;
}

function Contents ({mainComponent, headerComponent} : ContentsProps) {
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