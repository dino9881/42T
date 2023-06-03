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
        <button onClick={handleComponentChange}>관리자</button>
        <div className="contents-header"></div>
        <div className="contents-main">
        {currentComponent === 'Chat' && <Chat />}
        {currentComponent === 'ChannelAdmin' && <ChannelAdmin />}
        </div>
    </div>
  );
}

export default Contents;
