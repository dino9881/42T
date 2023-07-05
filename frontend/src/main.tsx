import React from "react";
import Sidebar from "./sidebar/Sidebar";
import Contents from "./Contents";
import Channel from "./channel/Channel";
import Menu from "./menu/Menu";
function Main() {
    return (
        <div>
            <Contents
                headerComponent={<Menu showBackButton={false} />}
                mainComponent={<Channel />}
            />
        </div>
    );
}

export default Main;
