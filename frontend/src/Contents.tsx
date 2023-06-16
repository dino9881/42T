import React, { useState } from "react";
import Chat from "./Chat";
import ChannelAdmin from "./ChannelAdmin";
import Menu from "./menu/Menu";

type ComponentType = 'Chat' | 'ChannelAdmin';

function Contents() {
        const [currentComponent, setCurrentComponent] = useState<ComponentType>('Chat');
        const handleComponentChange = () => {
            setCurrentComponent(currentComponent === 'Chat' ? 'ChannelAdmin' : 'Chat');
          };

          return <div className="contents">
        <div className="contents-header"></div>
        <div className="contents-main">
        <button onClick={handleComponentChange}>관리자</button>
        {currentComponent === 'Chat' && <Chat channelName="default"/>}
        {currentComponent === 'ChannelAdmin' && <ChannelAdmin />}
        </div>
    </div>
  
}

export default Contents;
