// import React, { useState } from "react";
// import './Menu.css';

// type MenuProps = {
//   showSettingButton: boolean;
//   showBackButton: boolean;
//   handleBackButton: () => void;
// };

// const Menu = ({ showSettingButton, showBackButton, handleBackButton }: MenuProps) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [toggleImgSrc, setToggleImgSrc] = useState("toggle_down.svg");
//   const [showWaiting, setShowWaiting] = useState(false);
//   const [showCancel, setShowCancel] = useState(false);

//   const handleToggle = () => {
//     setIsExpanded(!isExpanded);
//     setToggleImgSrc(isExpanded ? "toggle_down.svg" : "toggle_up.svg");
//   };

//   const handleStartClick = () => {
//     setShowWaiting(true);
//     setShowCancel(true);
//   };

//   const handleCancelClick = () => {
//     setShowWaiting(false);
//     setShowCancel(false);
//   };

//   return (
//     <div className="menu-box">
//       <button className="menu-channel-drop-box" onClick={handleToggle}>
//         channelname
//         <img src={toggleImgSrc} alt="toggle" className="menu-channel-drop-down-button" />
//       </button>
//       {showSettingButton ? (
//         <button className="menu-channel-new-box">Setting</button>
//       ) : (
//         <button className="menu-channel-new-box">new</button>
//       )}

//       {showBackButton && (
//         <button className="menu-back-button" onClick={handleBackButton}>
//           <img src="back-button.svg" alt="back" />
//         </button>
//       )}

//       <button className="menu-grin-button menu-start-button" onClick={handleStartClick}>
//         {showWaiting ? "Waiting" : "START"}
//       </button>
//       {showCancel && (
//         <button className="menu-grin-button menu-cancel-button" onClick={handleCancelClick}>
//           Cancel
//         </button>
//       )}
//       <button className="menu-grin-button menu-lank-button">Lank</button>
//       <button className="menu-grin-button menu-custom-button">custom</button>
//     </div>
//   );
// }

// export default Menu;

import React, { useState } from "react";
import './Menu.css';

type MenuProps = {
  showBackButton: boolean;
  handleBackButton: () => void;
};

const Menu = ({ showBackButton, handleBackButton }: MenuProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [toggleImgSrc, setToggleImgSrc] = useState("toggle_down.svg");
  const [showWaiting, setShowWaiting] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    setToggleImgSrc(isExpanded ? "toggle_down.svg" : "toggle_up.svg");
  };

  const handleStartClick = () => {
    setShowWaiting(true);
    setShowCancel(true);
  };

  const handleCancelClick = () => {
    setShowWaiting(false);
    setShowCancel(false);
  };

  return (
    <div className="menu-box">
      <button className="menu-channel-drop-box" onClick={handleToggle}>
		{showBackButton ? "channelname" : "Home"}
        <img src={toggleImgSrc} alt="toggle" className="menu-channel-drop-down-button" />
      </button>
      {showBackButton ? (
        <button className="menu-channel-new-box">Setting</button>
      ) : (
        <button className="menu-channel-new-box">new</button>
      )}

      {showBackButton && (
        <button className="menu-back-button" onClick={handleBackButton}>
          <img src="back-button.svg" alt="back" />
        </button>
      )}

      <button className="menu-grin-button menu-start-button" onClick={handleStartClick}>
        {showWaiting ? "Waiting" : "START"}
      </button>
      {showCancel && (
        <button className="menu-grin-button menu-cancel-button" onClick={handleCancelClick}>
          Cancel
        </button>
      )}
      <button className="menu-grin-button menu-lank-button">Lank</button>
      <button className="menu-grin-button menu-custom-button">custom</button>
    </div>
  );
}

export default Menu;
