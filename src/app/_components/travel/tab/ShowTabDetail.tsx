"use client"

import TimePicker from "@/app/_components/travel/GMGTimePicker";
import PlacePicker from "@/app/_components/travel/PlacePicker";
import React, {JSX} from "react";
import {FaRegCirclePlay, FaRegCircleStop} from "react-icons/fa6";
import dayjs from "dayjs";
import VehiclePicker from "@/app/_components/travel/VehiclePicker";
import {FaArrowRight} from "react-icons/fa";
import {MdOutlineKeyboardArrowDown} from "react-icons/md";
import {dateListInterface, placeListInterface} from "@interface/TravelInterface";
import {getRouteCar, getRouteCycleAndWalking, getRoutePublicTransport} from "@module/TravelModule";
import {addSeconds} from "date-fns";
import {changeDurationTime, changeTimeToSeconds} from "@module/TimeModule";

const TabDetail = (props: {
    map: kakao.maps.Map,
    placeList: placeListInterface[],
    dateList: dateListInterface[],
    setPlaceList: (list: placeListInterface[]) => void,
    setDateList: (list: dateListInterface[]) => void,
    dateSelected: string,
}) => {
    const removeDirectionGeometry = () => {
        let items = [...props.placeList];
        for (let i = 0; i < props.placeList.length; i++) {
            items[i].path = []
            items[i].public_path = []
            items[i].move_amount = 0
            items[i].move_time = new Date(new Date().setHours(0, 0))
            items[i].start_time = new Date(new Date().setHours(0, 0))
            items[i].end_time = new Date(new Date().setHours(0, 0))
        }
        props.setPlaceList(items)
    }

    const changePlacePath = async (paths: any[], time: number, distance: number, payment: number, index: number, type: number) => {
        const items = [...props.placeList];
        if (type === 3) {
            items[index].public_path = paths
        } else {
            items[index].path = paths
        }
        items[index].start_time = index === 0 ? addSeconds(props.dateList.filter(item => item.date === props.dateSelected)[0].start_time, changeTimeToSeconds(items[index].stay_time)) : addSeconds(items[index - 1].end_time, changeTimeToSeconds(items[index].stay_time))
        items[index].end_time = addSeconds(items[index].start_time, time)
        items[index].move_time = changeDurationTime(time)
        items[index].move_amount = payment
        items[index].distance = distance
        console.log(distance)
        props.setPlaceList(items)
    }

    const getDirectionGeometry = async () => {
        removeDirectionGeometry()
        for (let i = 0; i < props.placeList.length; i++) {
            let endPlace: placeListInterface = props.placeList.find((val, valIndex) => valIndex == i + 1) as placeListInterface
            if (props.placeList[i].vehicle_type === 1 || props.placeList[i].vehicle_type === 4) {
                let routeData = await getRouteCycleAndWalking(props.placeList[i], endPlace)
                await changePlacePath(routeData.paths, routeData.time, routeData.distance, routeData.payment, i, props.placeList[i].vehicle_type)
            } else if (props.placeList[i].vehicle_type === 2) {
                let routeData = await getRouteCar(props.placeList[i], endPlace)
                await changePlacePath(routeData.paths, routeData.time, routeData.distance, routeData.payment, i, props.placeList[i].vehicle_type)
            } else if (props.placeList[i].vehicle_type === 3) {
                let routeData = await getRoutePublicTransport(props.placeList[i], endPlace)
                await changePlacePath(routeData.paths, routeData.time, routeData.distance, routeData.payment * props.dateList[0].people, i, props.placeList[i].vehicle_type)
            }
        }
    }

    const setStartTime = (date: Date) => {
        props.setDateList(props.dateList.map(item => {
            if (item.date === props.dateSelected) {
                return { ...item, start_time: date }
            } else {
                return item
            }
        }))
    }

    const changePlaceType = (id: number, type: number, name: string, icon: JSX.Element) => {
        props.setPlaceList(props.placeList.map(item => {
            if (item.id === id) {
                return { ...item,
                    place_icon: icon,
                    place_type: type,
                    place_name: name,
                }
            } else {
                return item
            }
        }))
    }
    const changeVehicleType = (id: number, type: number, name: string, icon: JSX.Element, color: string) => {
        props.setPlaceList(props.placeList.map(item => {
            if (item.id === id) {
                return { ...item,
                    vehicle_icon: icon,
                    vehicle_type: type,
                    vehicle_name: name,
                    path_color: color,
                    path: [],
                    public_path: [],
                    move_amount: 0,
                    move_time: new Date(new Date().setHours(0, 0)),
                    start_time: new Date(new Date().setHours(0, 0)),
                    end_time: new Date(new Date().setHours(0, 0))
                }
            } else {
                return item
            }
        }))
    }

    const changePlaceStayTime = (id: number, date: Date) => {
        props.setPlaceList(props.placeList.map(item => {
            if (item.id === id) {
                return { ...item, stay_time: date }
            } else {
                return item
            }
        }))
    }
    const changePlaceStayAmount = (id: number, amount: string) => {
        props.setPlaceList(props.placeList.map(item => {
            if (item.id === id) {
                return { ...item, stay_amount: Number(amount) }
            } else {
                return item
            }
        }))
    }

    const changePlacePathHide = (id: number) => {
        props.setPlaceList(props.placeList.map(item => {
            if (item.id === id) {
                return { ...item, path_hide: !item.path_hide }
            } else {
                return item
            }
        }))
    }

    const changePlaceMoveAmount = (id: number, amount: string) => {
        props.setPlaceList(props.placeList.map(item => {
            if (item.id === id) {
                return { ...item, move_amount: Number(amount) }
            } else {
                return item
            }
        }))
    }

    return (
        <>
            <div className="all_road_section">
                <div className="place_control_section">
                    <div className="place_control_div">
                        <button className="scoredream-700 remove" onClick={() => removeDirectionGeometry()}>경로 삭제</button>
                        <button className="scoredream-700 search" onClick={() => getDirectionGeometry()}>경로 찾기</button>
                    </div>
                    <div className="place_stay_time_div">
                        <span className="scoredream-700 grey_text time_type">시작 시간</span>
                        <TimePicker
                            onChange={(date: Date | null) => date && setStartTime(date)}
                            type={1}
                            selectTime={props.dateList.filter(item => item.date === props.dateSelected)[0].start_time}
                            boxClassName={"time_input_div"}
                            inputClassName={"scoredream-700 default_text stay_time stay_time_times"}
                        />
                    </div>
                </div>
                {props.placeList.map((item: any, index: number) => {
                    return (
                        <div key={index}>
                            <div
                                className="place_list_section"
                                onClick={() => props.map?.panTo(new kakao.maps.LatLng(Number(item.lat), Number(item.lng)))}
                            >
                                <PlacePicker placeItem={item} onChange={(id: number, type: number, name: string, icon: JSX.Element) => changePlaceType(id, type, name, icon)}/>
                                <div className="place_list_div">
                                    <span className="scoredream-700 default_text place">{item.place}</span>
                                    <span className="scoredream-500 grey_text address">{item.address}</span>
                                </div>
                                <div className="place_amount_div">
                                    <span className="scoredream-700 grey_text amount_type">이용 비용</span>
                                    <div className="amount_input_div">
                                        <input type="text" maxLength={4} className="scoredream-700 default_text amount" value={item.stay_amount} onChange={(event) => changePlaceStayAmount(item.id, event.target.value)}/>
                                        <span className="scoredream-700 grey_text amount_unit">만원</span>
                                    </div>
                                </div>
                                <div className="place_stay_time_div">
                                    <span className="scoredream-700 grey_text time_type">머무는 시간</span>
                                    <TimePicker
                                        onChange={(date: Date | null) => date && changePlaceStayTime(item.id, date)}
                                        type={0}
                                        selectTime={item.stay_time}
                                        boxClassName={"time_input_div"}
                                        inputClassName={"scoredream-700 default_text stay_time stay_time_hours"}
                                        unitClassName={"scoredream-700 grey_text time_unit"}
                                    />
                                </div>
                            </div>
                            {index === props.placeList.length - 1 ? null :
                                <>
                                    <div
                                        className={item.path_hide ? "place_path_section display_none" : "place_path_section"}
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
                                                    <input className="scoredream-700 default_text move_time" value={dayjs(item.start_time).format("HH:mm")} readOnly={true}/>
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
                                                    <input className="scoredream-700 default_text move_time" value={dayjs(item.end_time).format("HH:mm")} readOnly={true}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="place_road_section"
                                    >
                                        <VehiclePicker vehicleItem={item} onChange={(id: number, type: number, name: string, icon: JSX.Element, color: string) => changeVehicleType(id, type, name, icon, color)}/>
                                        <div className="place_list_div">
                                            <span className="scoredream-700 default_text place">{item.place}</span>
                                            <FaArrowRight className="arrow"/>
                                            <span className="scoredream-700 default_text place">{props.placeList.find((val, valIndex )=> valIndex == index + 1)?.place}</span>
                                        </div>
                                        <div className="place_amount_div">
                                            <span className="scoredream-700 grey_text amount_type">이용 비용</span>
                                            <div className="amount_input_div">
                                                <input type="text" maxLength={4} className="scoredream-700 default_text amount" value={item.move_amount} onChange={(event) => changePlaceMoveAmount(item.id, event.target.value)}/>
                                                <span className="scoredream-700 grey_text amount_unit">만원</span>
                                            </div>
                                        </div>
                                        <div className="place_stay_time_div">
                                            <span className="scoredream-700 grey_text time_type">이동 시간</span>
                                            <div className="time_input_div">
                                                <input className="scoredream-700 default_text stay_time stay_time_hours" readOnly={true} value={dayjs(item.move_time).format("HH")}/>
                                                <span className="scoredream-700 grey_text time_unit">시간</span>
                                                <input className="scoredream-700 default_text stay_time stay_time_hours" readOnly={true} value={dayjs(item.move_time).format("mm")}/>
                                                <span className="scoredream-700 grey_text time_unit">분</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="place_path_hide_btn" onClick={() => changePlacePathHide(item.id)}>
                                        <MdOutlineKeyboardArrowDown className={item.path_hide ? "place_path_hide_icon" : "place_path_hide_icon active"}/>
                                    </button>
                                </>
                            }
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default TabDetail;