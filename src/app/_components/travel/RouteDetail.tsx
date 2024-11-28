"use client"
import React from "react";
import {MdClose} from "react-icons/md";
import {placeListInterface} from "@interface/TravelInterface";

const RouteDetail = (props: {
    placeList: placeListInterface[],
    placeId: number,
    setRouteDetail: (status: boolean) => void
}) => {

    return (
        <>
            <div className="route_detail_section">
                <div className="route_button_div">
                    <div className="close_div">
                        <MdClose className="close_icon" onClick={() => {
                            props.setRouteDetail(false)
                        }}/>
                    </div>
                </div>
                <div className="route_detail_div">
                    <div className="route_detail_nothing">
                        <span className="scoredream-700 grey_text">검색된 경로가 없습니다.<br/>이동수단을 선택 후 경로 찾기를 해주세요.</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RouteDetail;