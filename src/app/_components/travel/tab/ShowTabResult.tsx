"use client"
import React, {useEffect, useState} from "react";
import {FaRegCirclePlay, FaRegCircleStop} from "react-icons/fa6";
import dayjs from "dayjs";
import {FaArrowRight} from "react-icons/fa";
import {dateListInterface, placeListInterface} from "@interface/TravelInterface";

const TabResult = (props: {
    map: kakao.maps.Map,
    placeList: placeListInterface[],
    dateList: dateListInterface[],
    dateSelected: string,
}) => {
    const [totalDistance, setTotalDistance] = useState("0")
    const [totalTime, setTotalTime] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)

    useEffect(() => {
        const list = props.placeList
        let hour = 0
        let min = 0
        let sec = 0
        let distance: number = 0
        let amount = 0
        for (let i = 0; i < list.length; i++) {
            let stayTime = list[i].stay_time
            let moveTime = list[i].move_time
            let stayAmount = list[i].stay_amount
            let moveAmount = list[i].move_amount
            let moveDistance = list[i].distance
            hour += stayTime.getHours() + moveTime.getHours()
            min += stayTime.getMinutes() + moveTime.getMinutes()
            sec += stayTime.getSeconds() + moveTime.getSeconds()
            amount += stayAmount + moveAmount
            distance += moveDistance

            if (sec >= 60) {
                min += Math.floor(sec / 60)
                sec = sec % 60
            }
            if (min >= 60) {
                hour += Math.floor(min / 60)
                min = min % 60
            }
        }

        setTotalDistance(distance.toFixed(2))
        setTotalAmount(amount)
        setTotalTime(hour)
    }, [props.placeList])

    return (
        <>
            <div className="all_result_section">
                <div className="place_control_section">
                    <div className="place_control_div">
                        <div>
                            <span className="scoredream-700 grey_text title">총 거리 :&nbsp;<span className="default_text">{totalDistance} km</span></span>
                            <span className="scoredream-700 grey_text title">총 시간 :&nbsp;<span className="default_text">{totalTime} 시간</span></span>
                        </div>
                        <div>
                            <span className="scoredream-700 grey_text title">총 비용 :&nbsp;<span className="default_text">{totalAmount} 만원</span></span>
                            <span className="scoredream-700 grey_text title">경유지 수 :&nbsp;<span className="default_text">{props.placeList.length} 곳</span></span>
                        </div>
                    </div>
                    <div className="place_stay_time_div">
                        <span className="scoredream-700 grey_text time_type">시작 시간</span>
                        <div className="gmg_time_picker_section time_input_div">
                            <span className="scoredream-700 default_text stay_time stay_time_times">{dayjs(props.dateList.filter(item => item.date === props.dateSelected)[0].start_time).format("HH:mm")}</span>
                        </div>
                    </div>
                </div>
                {props.placeList.map((item: any, index: number) => {
                    return (
                        <div key={index}>
                            <div
                                className="place_list_section"
                            >
                                <div className={"select_place_div " + item.place_name}>
                                    {item.place_icon}
                                </div>
                                <div className="place_list_div">
                                    <span className="scoredream-700 default_text place">{item.place}</span>
                                    <span className="scoredream-500 grey_text address">{item.address}</span>
                                </div>
                                <div className="place_amount_div">
                                    <span className="scoredream-700 grey_text amount_type">이용 비용</span>
                                    <div className="amount_input_div">
                                        <span className="scoredream-700 default_text amount">{item.stay_amount}</span>
                                        <span className="scoredream-700 grey_text amount_unit">만원</span>
                                    </div>
                                </div>
                                <div className="place_stay_time_div">
                                    <span className="scoredream-700 grey_text time_type">머무는 시간</span>
                                    <div className="gmg_time_picker_section time_input_div">
                                        <span className="scoredream-700 default_text stay_time stay_time_hours">{dayjs(item.stay_time).format("HH")}</span>
                                        <span className="scoredream-700 grey_text time_unit">시간</span>
                                        <span className="scoredream-700 default_text stay_time stay_time_hours">{dayjs(item.stay_time).format("mm")}</span>
                                        <span className="scoredream-700 grey_text time_unit">분</span>
                                    </div>
                                </div>
                            </div>
                            {index === props.placeList.length - 1 ? null :
                                <>
                                    <div
                                        className="place_path_section"
                                    >
                                        <div className="place_path_start">
                                            <div className="select_place_div default">
                                                <FaRegCirclePlay className="select_place_icon"/>
                                            </div>
                                            <div className="place_list_div">
                                                <span className="scoredream-700 grey_text place">출발</span>
                                                <span className="scoredream-700 default_text place">{item.place}</span>
                                            </div>
                                            <div className="place_move_time_div">
                                                <span className="scoredream-700 grey_text time_type">출발 시간</span>
                                                <div className="time_input_div">
                                                    <span className="scoredream-700 default_text move_time">{dayjs(item.start_time).format("HH:mm")}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="place_path_end">
                                            <div className="select_place_div default">
                                                <FaRegCircleStop className="select_place_icon"/>
                                            </div>
                                            <div className="place_list_div">
                                                <span className="scoredream-700 grey_text place">도착</span>
                                                <span className="scoredream-700 default_text place">{props.placeList.find((val, valIndex) => valIndex == index + 1)?.place}</span>
                                            </div>
                                            <div className="place_move_time_div">
                                                <span className="scoredream-700 grey_text time_type">도착 시간</span>
                                                <div className="time_input_div">
                                                    <span className="scoredream-700 default_text move_time">{dayjs(item.end_time).format("HH:mm")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="place_road_section"
                                    >
                                        <div className={"select_vehicle_div " + item.vehicle_name}>
                                            {item.vehicle_icon}
                                        </div>
                                        <div className="place_list_div">
                                            <span className="scoredream-700 default_text place">{item.place}</span>
                                            <FaArrowRight className="arrow"/>
                                            <span className="scoredream-700 default_text place">{props.placeList.find((val, valIndex )=> valIndex == index + 1)?.place}</span>
                                        </div>
                                        <div className="place_amount_div">
                                            <span className="scoredream-700 grey_text amount_type">이용 비용</span>
                                            <div className="amount_input_div">
                                                <span className="scoredream-700 default_text amount">{item.move_amount}</span>
                                                <span className="scoredream-700 grey_text amount_unit">만원</span>
                                            </div>
                                        </div>
                                        <div className="place_stay_time_div">
                                            <span className="scoredream-700 grey_text time_type">이동 시간</span>
                                            <div className="time_input_div">
                                                <span className="scoredream-700 default_text stay_time stay_time_hours">{dayjs(item.move_time).format("HH")}</span>
                                                <span className="scoredream-700 grey_text time_unit">시간</span>
                                                <span className="scoredream-700 default_text stay_time stay_time_hours">{dayjs(item.move_time).format("mm")}</span>
                                                <span className="scoredream-700 grey_text time_unit">분</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default TabResult;