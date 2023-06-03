// import React, { useState } from "react";
// import Chat from "./Chat";
// import Sidebar from "./sidebar/Sidebar";
// import Menu from "./menu/Menu";

// type ComponentType = 'Chat' | 'Sidebar';

// function Contents() {
//   const [currentComponent, setCurrentComponent] = useState<ComponentType>('Chat');
//   const [showBackButton, setShowBackButton] = useState(false);
//   const [showSettingButton, setShowSettingButton] = useState(false);

//   const handleComponentChange = () => {
//     setCurrentComponent(currentComponent === 'Chat' ? 'Sidebar' : 'Chat');
//     setShowBackButton(!showBackButton);
//   };

//   const handleBackButton = () => {
//     setCurrentComponent('Chat');
//     setShowBackButton(false);
//   };

//   return (
//     <div className="contents">
//       <div className="contents-header">
//         <Menu showSettingButton={showSettingButton} showBackButton={showBackButton} handleBackButton={handleBackButton} />
//       </div>
//       <div className="contents-main">
//         <button onClick={handleComponentChange}>dd</button>
//         {currentComponent === 'Chat' && <Chat />}
//         {currentComponent === 'Sidebar' && <Sidebar />}
//       </div>
//     </div>
//   );
// }

// export default Contents;


import React, { useState } from "react";
import Chat from "./Chat";
import Sidebar from "./sidebar/Sidebar";
import Menu from "./menu/Menu";

type ComponentType = 'Chat' | 'Sidebar';

function Contents() {
  const [currentComponent, setCurrentComponent] = useState<ComponentType>('Chat');
  const [showBackButton, setShowBackButton] = useState(false);

  const handleComponentChange = () => {
    setCurrentComponent(currentComponent === 'Chat' ? 'Sidebar' : 'Chat');
    setShowBackButton(!showBackButton);
  };

  const handleBackButton = () => {
    setCurrentComponent('Chat');
    setShowBackButton(false);
  };

  return (
    <div className="contents">
      <div className="contents-header">
        <Menu showBackButton={showBackButton} handleBackButton={handleBackButton} />
      </div>
      <div className="contents-main">
        <button onClick={handleComponentChange}>dd</button>
        {currentComponent === 'Chat' && <Chat />}
        {currentComponent === 'Sidebar' && <Sidebar />}
      </div>
    </div>
  );
}

export default Contents;
