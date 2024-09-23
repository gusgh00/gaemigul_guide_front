'use client'
import {Map} from "react-kakao-maps-sdk";

const Travel = () => {
    return (
        <>
            <div id="main_content">
                <div className="travel_top_banner">

                </div>
                <Map
                    id="map"
                    center={{
                        lat: 33.450701,
                        lng: 126.570667,
                    }}
                    style={{
                        width: "1920px",
                        height: "866px",
                    }}
                    level={3}
                />
            </div>
        </>
    )
}

export default Travel