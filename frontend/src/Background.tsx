import React from "react";



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
            <h4>2023 ft_transcendence</h4>
        </div>

    )
}

export default Background;