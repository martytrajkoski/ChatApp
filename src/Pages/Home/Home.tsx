import ChatSidebar from "../../Components/ChatSidebar/ChatSidebar";
import { Outlet } from "react-router-dom";
import { getSeasonBackground } from "../../Components/Background/Background";
import { useEffect, useState } from "react";

const Home: React.FC = () =>{

    const [backgroundImage, setBackgroundImage] = useState<string>('');

    useEffect(() => {
        const seasonBackground = getSeasonBackground();
        setBackgroundImage(seasonBackground);
    }, [])

    return(
        <div className="home-container" style={{ backgroundImage: `url(${backgroundImage})`}} >
            <ChatSidebar></ChatSidebar>
            <div className="container">
                <Outlet />
            </div>
        </div>
    )
}

export default Home;