"use client"
import React, {useEffect, useState} from "react";
import {MdClose} from "react-icons/md";
import {placeListInterface, routeListPath} from "@interface/TravelInterface";
import {dummyPlaceData, initialPlaceLists} from "@module/DataArrayModule";
import {changeDurationTime} from "@module/TimeModule";

const RouteDetail = (props: {
    placeList: placeListInterface[],
    placeId: number,
    setRouteDetail: (status: boolean) => void
}) => {
    const [placeItem, setPlaceItem] = useState<placeListInterface>(initialPlaceLists[0])
    const [routeList, setRouteList] = useState<routeListPath[]>([])

    useEffect(() => {
        let placeList = props.placeList
        let placeItem = placeList.filter(item => item.id === props.placeId)[0]
        setPlaceItem(placeItem)
        setRouteList(placeItem.route)
    }, [props.placeList, props.placeId]);

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
                    {!!routeList && routeList?.length > 0 ?
                        routeList?.map((item, index) => {
                            return (
                                <div className="route_item_section" key={index}>
                                    <div className="route_icon_div">
                                        <div className="line_top"
                                             style={{ background: index !== 0 && item.type === routeList[index - 1].type ? item.color : "transparent" }}
                                        ></div>
                                        <div className="circle"
                                             style={{ borderColor: item.color }}
                                        ></div>
                                        <div className="line_bottom"
                                             style={{ background: index !== routeList.length - 1 && item.type === routeList[index + 1].type ? item.color : "transparent"}}
                                        ></div>
                                    </div>
                                    <div className="route_info_div">
                                        <span className="scoredream-700 default_text name">{item.name === "" ? "일반도로" : item.name}</span>
                                        {item.type !== 2 && <div className="route_item_sub">
                                            <span className="scoredream-700 default_text sub">거리 :</span>
                                            <span className="scoredream-700 grey_text sub">{item.distance > 1000 ? (item.distance / 1000).toFixed(3) + "km" : item.distance.toFixed(3) + "m"}</span>
                                            <span className="scoredream-700 default_text sub">소요시간 :</span>
                                            <span className="scoredream-700 grey_text sub">
                                                {changeDurationTime(item.duration).getHours() === 0 ? null : changeDurationTime(item.duration).getHours() + "시간 "}
                                                {changeDurationTime(item.duration).getMinutes() === 0 ? null : changeDurationTime(item.duration).getMinutes() + "분 "}
                                                {changeDurationTime(item.duration).getSeconds() === 0 ? null : changeDurationTime(item.duration).getSeconds() + "초"}
                                            </span>
                                        </div>}
                                    </div>
                                </div>
                            )
                        }) :
                    <div className="route_detail_nothing">
                        <span className="scoredream-700 grey_text">검색된 경로가 없습니다.<br/>이동수단을 선택 후 경로 찾기를 해주세요.</span>
                    </div>}
                </div>
            </div>
        </>
    );
};

export default RouteDetail;