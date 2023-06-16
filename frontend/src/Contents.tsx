import React, { useState } from "react";
import Chat from "./Chat";
import Sidebar from "./sidebar/Sidebar";
import Menu from "./menu/Menu";

interface ContentsProps {
  // headerComponent: React.ReactNode;
  mainComponent: React.ReactNode;
}

function Contents ({mainComponent} : ContentsProps) {
          return <div className="contents">
        <div className="contents-header"></div>
        <div className="contents-main">
          {mainComponent}
        </div>
    </div>
  );
}

export default Contents;