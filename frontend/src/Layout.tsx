import React from "react";



function Layout(){
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
        <footer className='footer'>
            <h4>2023 ft_transcendence</h4>
        </footer>

    )
}

export default Layout;