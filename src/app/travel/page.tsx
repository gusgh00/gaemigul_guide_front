'use client'
import {Map} from "react-kakao-maps-sdk";
import {useState} from "react";

const Travel = () => {
    const [isHideList, setHideList] = useState(false)
    return (
        <>
            <div>
                <div className="travel_top_banner">
                    <div className="banner_inner main_inner">
                        <div className="banner_inner_info">
                            <span className="scoredream-500 default_text">날짜 : <span className="scoredream-500 grey_text">2024월 10월 12일 ~ 2024년 10월 15일</span></span>
                            <span className="scoredream-500 default_text">대표지역 : <span className="scoredream-500 grey_text">제주도</span></span>
                            <span className="scoredream-500 default_text">인원 : <span className="scoredream-500 grey_text">3명</span></span>
                        </div>
                        <div className="banner_inner_button">
                            <div className="banner_button_clear">
                                <span className="scoredream-700 white_text">처음부터</span>
                            </div>
                            <div className="banner_button_save">
                                <span className="scoredream-700 white_text">저장하기</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={!isHideList ? "travel_list_section travel_list_section_no_hide" : "travel_list_section travel_list_section_hide"}>
                    <div className="travel_list_box"></div>
                    <div className="travel_list_button" onClick={() => setHideList(!isHideList)}>
                    </div>
                </div>
                <div className="travel_search_section">

                </div>
                <Map
                    id="map"
                    center={{
                        lat: 37.5547125,
                        lng: 126.9707878,
                    }}
                    style={{
                        width: "1920px",
                        height: "866px",
                    }}
                    className="travel_map"
                    level={3}
                />
            </div>
        </>
    )
}

export default Travel