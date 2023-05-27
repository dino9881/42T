import React, { useState } from "react";
import Chat from "./Chat";
import Sidebar from "./sidebar/Sidebar";

type ComponentType = 'Chat' | 'Sidebar';

function Contents() {
        const [currentComponent, setCurrentComponent] = useState<ComponentType>('Chat');
        const handleComponentChange = () => {
            setCurrentComponent(currentComponent === 'Chat' ? 'Sidebar' : 'Chat');
          };

    return <div className="contents">
        <button onClick={handleComponentChange}>dd</button>
        <div className="contents-header"></div>
        <div className="contents-main">
        {currentComponent === 'Chat' && <Chat />}
        {currentComponent === 'Sidebar' && <Sidebar />}
        </div>
    </div>
}

export default Contents