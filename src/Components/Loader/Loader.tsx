import React, { useEffect, useState } from "react";
import { getSeasonBackground } from "../Background/Background";

const Loader: React.FC = () => {

    const [backgroundImage, setBackgroundImage] = useState<string>('');

    useEffect(() => {
        const seasonBackground = getSeasonBackground();
        setBackgroundImage(seasonBackground);
    }, [])

    return (
        <div className="loader" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="container">
                <div className="loadingspinner">
                    <div id="square1"></div>
                    <div id="square2"></div>
                    <div id="square3"></div>
                    <div id="square4"></div>
                    <div id="square5"></div>
                </div>
            </div>
        </div>
    )
}

export default Loader;