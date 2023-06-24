import React from "react";
import { Link } from "react-router-dom";

function Background(){
    return <div>
        <Header />
        <Footer />
    </div>;
}



function Header(){
    return (
    <header>
        {/* <h2>42T header</h2> */}
    </header>);
}

function Footer(){
    return (
        <div className='footer'>
            <h4>
              <Link to="/main" style={{ textDecoration: "none", color: "inherit" }}>2023 ft_transcendence</Link>
            </h4>
        </div>

    )
}

export default Background;