'use client'
import type {JSX} from 'react'
import {Map, MapMarker, Polyline} from "react-kakao-maps-sdk";
import React, {Suspense, useEffect, useState} from "react";
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    DraggableStateSnapshot,
    Droppable,
    DroppableProvided,
    DroppableStateSnapshot,
    DropResult
} from "@hello-pangea/dnd";
import {RxDragHandleHorizontal} from "react-icons/rx";
import {
    FaArrowRight,
    FaPlus,
} from "react-icons/fa";
import {MdClose, MdOutlineKeyboardArrowDown} from "react-icons/md";
import {GrPowerReset} from "react-icons/gr";
import {FaRegCirclePlay, FaRegCircleStop} from "react-icons/fa6";
import ControlTravel from "@/app/_components/travel/ControlTravel";
import TimePicker from "@/app/_components/travel/GMGTimePicker";
import dayjs from "dayjs";
import {addSeconds} from "date-fns";
import PlacePicker from "@/app/_components/travel/PlacePicker";
import VehiclePicker from "@/app/_components/travel/VehiclePicker";
import TravelSearch from "@/app/_components/travel/TravelSearch";
import {
    findMaxIdLocation,
    getRouteCar,
    getRouteCycleAndWalking,
    getRoutePublicTransport
} from "@module/TravelModule";
import {
    dummyPlaceData,
    initialDateLists,
    initialPlaceLists
} from '@module/DataArrayModule'
import {
    changeDurationTime,
    changeTimeToSeconds
} from "@module/TimeModule"
import {
    dateListInterface, dropdownIconPlaceInterface,
    placeListInterface,
    searchListInterface
} from "@interface/TravelInterface";

const Travel = () => {
    const [isAddList, setAddList] = useState(false)
    const [isAddPlaceId, setAddPlaceId] = useState(0)
    const [isHideControl, setHideControl] = useState(false)
    const [isHideList, setHideList] = useState(false)
    const [isListReady, setListReady] = useState(false)
    const [dateList, setDateList] = useState<dateListInterface[]>(initialDateLists);
    const [placeList, setPlaceList] = useState<placeListInterface[]>(initialPlaceLists);
    const [isTab, setTab] = useState(0)
    const [dateSelected, setDateSelected] = useState<string>("")
    const [searchList, setSearchList] = useState<searchListInterface[]>([]);
    const [isPlaceMarkerInfo, setPlaceMarkerInfo] = useState(false)
    const [isPlaceMarkerInfoId, setPlaceMarkerInfoId] = useState(0)
    const [isSearchMarkerInfo, setSearchMarkerInfo] = useState(false)
    const [isSearchMarkerInfoId, setSearchMarkerInfoId] = useState(0)
    const [startTime, setStartTime] = useState<Date>(new Date(new Date().setHours(0,0)))
    const [isMapDraggable, setMapDraggable] = useState(true)
    const [isMapZoomable, setMapZoomable] = useState(true)
    const [map, setMap] = useState<kakao.maps.Map>()

    const tabList = ['경유지 탐색', '경유지 상세', '최종 계획']

    useEffect(() => {
        setListReady(true)
    }, [])

    const handleDragEnd = ({source, destination}: DropResult) => {
        if (!destination) return;

        const items = Array.from(placeList);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);

        setPlaceList(items);
    }

    const closePlaceList = (index: number) => {
        const items = Array.from(placeList);
        items.splice(index, 1);

        setPlaceList(items);
    }

    const changePlaceStayTime = (id: number, date: Date) => {
        setPlaceList(placeList.map(item => {
            if (item.id === id) {
                return { ...item, stay_time: date }
            } else {
                return item
            }
        }))
    }
    const changePlaceStayAmount = (id: number, amount: string) => {
        setPlaceList(placeList.map(item => {
            if (item.id === id) {
                return { ...item, stay_amount: Number(amount) }
            } else {
                return item
            }
        }))
    }
    const changePlaceMoveAmount = (id: number, amount: string) => {
        setPlaceList(placeList.map(item => {
            if (item.id === id) {
                return { ...item, move_amount: Number(amount) }
            } else {
                return item
            }
        }))
    }
    const changePlacePathHide = (id: number) => {
        setPlaceList(placeList.map(item => {
            if (item.id === id) {
                return { ...item, path_hide: !item.path_hide }
            } else {
                return item
            }
        }))
    }
    const changePlaceType = (id: number, type: number, name: string, icon: JSX.Element) => {
        setPlaceList(placeList.map(item => {
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
        setPlaceList(placeList.map(item => {
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

    const addSearchList = (place: string, lat: string, lng: string, address: string, place_icon: dropdownIconPlaceInterface, index: number) => {
        const tempPlaceList: placeListInterface[] = [...placeList]
        const frontPlaceIndex = placeList.findIndex(item => item.id === isAddPlaceId)
        const maxPlaceId = findMaxIdLocation(tempPlaceList).id
        const newPlaceItem: placeListInterface = {
            ...dummyPlaceData,
            id: maxPlaceId + 1,
            place: place,
            lat: lat,
            lng: lng,
            address: address,
            place_icon: place_icon.place_icon,
            place_type: place_icon.place_type,
            place_name: place_icon.place_name,
        }
        tempPlaceList.splice(frontPlaceIndex + 1, 0, newPlaceItem)
        setPlaceList(tempPlaceList)

        if (searchList) {
            const tempSearchList: searchListInterface[] = [...searchList]
            tempSearchList.splice(index, 1)
            setSearchList(tempSearchList)
        }
    }

    const changePlacePath = async (paths: any[], time: number, payment: number, index: number, type: number) => {
        const items = [...placeList];
        if (type === 3) {
            items[index].public_path = paths
        } else {
            items[index].path = paths
        }
        items[index].start_time = index === 0 ? addSeconds(startTime, changeTimeToSeconds(items[index].stay_time)) : addSeconds(items[index - 1].end_time, changeTimeToSeconds(items[index].stay_time))
        items[index].end_time = addSeconds(items[index].start_time, time)
        items[index].move_time = changeDurationTime(time)
        items[index].move_amount = payment
        setPlaceList(items)
    }

    const getDirectionGeometry = async () => {
        removeDirectionGeometry()
        for (let i = 0; i < placeList.length; i++) {
            let endPlace: placeListInterface = placeList.find((val, valIndex) => valIndex == i + 1) as placeListInterface
            if (placeList[i].vehicle_type === 1 || placeList[i].vehicle_type === 4) {
                let routeData = await getRouteCycleAndWalking(placeList[i], endPlace)
                await changePlacePath(routeData.paths, routeData.time, routeData.payment, i, placeList[i].vehicle_type)
            } else if (placeList[i].vehicle_type === 2) {
                let routeData = await getRouteCar(placeList[i], endPlace)
                await changePlacePath(routeData.paths, routeData.time, routeData.payment, i, placeList[i].vehicle_type)
            } else if (placeList[i].vehicle_type === 3) {
                let routeData = await getRoutePublicTransport(placeList[i], endPlace)
                await changePlacePath(routeData.paths, routeData.time, routeData.payment * dateList[0].people, i, placeList[i].vehicle_type)
            }
        }
    }

    const removeDirectionGeometry = () => {
        let items = [...placeList];
        for (let i = 0; i < placeList.length; i++) {
            items[i].path = []
            items[i].public_path = []
            items[i].move_amount = 0
            items[i].move_time = new Date(new Date().setHours(0, 0))
        }
        setPlaceList(items)
    }

    const showTab = () => {
        switch (isTab) {
            case 0:
                return <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="placeList">
                        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                            <div
                                ref={provided.innerRef}
                                className={snapshot.isDraggingOver ? "all_place_section all_place_section_is_dragging" : "all_place_section"}
                                {...provided.droppableProps}>
                                {placeList.map((item: any, index: number) => {
                                    return (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id.toString()}
                                            index={index}
                                        >
                                            {(provided: DraggableProvided, snapshot2: DraggableStateSnapshot) => (
                                                <>
                                                    <div
                                                        ref={provided.innerRef}
                                                        className={snapshot2.isDragging ? "place_list_section place_list_section_is_dragging" : "place_list_section"}
                                                        {...provided.draggableProps}
                                                    >
                                                        <div
                                                            className="drag_handler_div"
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <RxDragHandleHorizontal className="drag_handler_icon"/>
                                                        </div>
                                                        <div className="place_list_div" onClick={() => map?.panTo(new kakao.maps.LatLng(Number(item.lat), Number(item.lng)))}>
                                                            <span className="scoredream-700 default_text place">{"[" + (index + 1) + "] "}{item.place}</span>
                                                            <span className="scoredream-500 grey_text address">{item.address}</span>
                                                        </div>
                                                        <div className={placeList.length > 1 ? "close_div" : "display_none"}>
                                                            <MdClose className="close_icon" onClick={() => {
                                                                closePlaceList(index)
                                                                if (item.id === isAddPlaceId) {
                                                                    setAddList(false)
                                                                }
                                                            }}/>
                                                        </div>
                                                        {placeList.length >= 10 ? null :
                                                        <button className={isAddPlaceId === item.id && isAddList ? "add_button active" : "add_button"} onClick={() => {
                                                            setAddList(true)
                                                            setAddPlaceId(item.id)
                                                            setSearchList([])
                                                            map?.panTo(new kakao.maps.LatLng(Number(item.lat), Number(item.lng)))
                                                        }}>
                                                            <FaPlus className="add_icon"/>
                                                        </button>}
                                                    </div>
                                                </>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            case 1:
                return <div className="all_road_section">
                    <div className="place_control_section">
                        <div className="place_control_div">
                            <button className="scoredream-700 remove" onClick={() => removeDirectionGeometry()}>경로 삭제</button>
                            <button className="scoredream-700 search" onClick={() => getDirectionGeometry()}>경로 찾기</button>
                        </div>
                        <div className="place_stay_time_div">
                            <span className="scoredream-700 grey_text time_type">시작 시간</span>
                            <TimePicker
                                onChange={(date: Date | null) => date && setStartTime(date)}
                                selectTime={startTime}
                                boxClassName={"time_input_div"}
                                inputClassName={"scoredream-700 default_text stay_time"}
                            />
                        </div>
                    </div>
                    {placeList.map((item: any, index: number) => {
                        return (
                            <div key={index}>
                                <div
                                    className="place_list_section"
                                    onClick={() => map?.panTo(new kakao.maps.LatLng(Number(item.lat), Number(item.lng)))}
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
                                            selectTime={item.stay_time}
                                            boxClassName={"time_input_div"}
                                            inputClassName={"scoredream-700 default_text stay_time"}
                                        />
                                    </div>
                                </div>
                                {index === placeList.length - 1 ? null :
                                    <>
                                        <div
                                            className={item.path_hide ? "place_path_section display_none" : "place_path_section"}
                                        >
                                            <div className="place_path_start">
                                                <div className="select_place_div default">
                                                    <FaRegCirclePlay className="select_place_icon"/>
                                                </div>
                                                <div className="place_list_div">
                                                    <span className="scoredream-700 default_text place">{item.place}</span>
                                                    <span className="scoredream-700 grey_text place">출발</span>
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
                                                    <span className="scoredream-700 default_text place">{placeList.find((val, valIndex) => valIndex == index + 1)?.place}</span>
                                                    <span className="scoredream-700 grey_text place">도착</span>
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
                                                <span className="scoredream-700 default_text place">{placeList.find((val, valIndex )=> valIndex == index + 1)?.place}</span>
                                            </div>
                                            <div className="place_amount_div">
                                                <span className="scoredream-700 grey_text amount_type">이용 비용</span>
                                                <div className="amount_input_div">
                                                    <input type="text" maxLength={4} className="scoredream-700 default_text amount" value={item.move_amount} onChange={(event) => changePlaceMoveAmount(item.id, event.target.value)}/>
                                                    <span className="scoredream-700 grey_text amount_unit">만원</span>
                                                </div>
                                            </div>
                                            <div className="place_move_time_div">
                                                <span className="scoredream-700 grey_text time_type">이동 시간</span>
                                                <div className="time_input_div">
                                                    <input className="scoredream-700 default_text move_time" value={dayjs(item.move_time).format("HH:mm")} readOnly={true}/>
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
            case 2:
                return <></>
        }
    }

    const handleChangeDateSelect= (e: React.ChangeEvent<any>) => {
        setDateList(dateList.map(item => {
            if (item.date === dateSelected) {
                return { ...item, place_list: placeList }
            } else {
                return item
            }
        }))
        setDateSelected(e.target.value);
        let tempDateList = dateList.filter(item => item.date === e.target.value)[0]
        setPlaceList(tempDateList.place_list)
        map?.panTo(new kakao.maps.LatLng(Number(tempDateList.place_list[0].lat), Number(tempDateList.place_list[0].lng)))
    }

    const handleResetDateSelected = () => {
        let tempDateList = dateList.filter(item => item.date === dateSelected)[0]
        const newPlaceItem: placeListInterface = {
            id: tempDateList.id,
            place: tempDateList.place,
            lat: tempDateList.lat,
            lng: tempDateList.lng,
            address: tempDateList.address,
            ...dummyPlaceData
        }
        setPlaceList([newPlaceItem])
        map?.panTo(new kakao.maps.LatLng(Number(tempDateList.lat), Number(tempDateList.lng)))
    }

    const updateControlTravel = (dateList: dateListInterface[]) => {
        setHideControl(true)
        setDateList(dateList)
        setDateSelected(dateList[0].date)
        setPlaceList(dateList[0].place_list)
        map?.panTo(new kakao.maps.LatLng(Number(dateList[0].place_list[0].lat), Number(dateList[0].place_list[0].lng)))
    }

    useEffect(() => {
        if (!map) return
        else {
            if (isTab === 2) {
                let bounds = new kakao.maps.LatLngBounds()

                placeList.forEach((item) => {
                    bounds.extend(new kakao.maps.LatLng(Number(item.lat), Number(item.lng)))
                })

                map.setBounds(bounds)
                setMapDraggable(false)
                setMapZoomable(false)
            } else {
                setMapDraggable(true)
                setMapZoomable(true)
            }
        }
    }, [isTab, placeList, map]);

    useEffect(() => {
        let infoTitle = document.querySelectorAll('.marker_info');
        infoTitle.forEach(function(value: Element) {
            if (value.parentElement && value.parentElement.parentElement) {
                value.parentElement.parentElement.style.border = "0px";
                value.parentElement.parentElement.style.background = "unset";
                value.parentElement.parentElement.style.width = "100%";
                let bubbleBottom: HTMLElement = value.parentElement.previousElementSibling as HTMLElement
                bubbleBottom.style.display = "none";
            }
        });
    }, [isSearchMarkerInfo, isPlaceMarkerInfo]);

    return (
        <>
            <div>
                {!isHideControl ?
                    <Suspense>
                        <ControlTravel setControlTravel={updateControlTravel}/>
                    </Suspense>
                    : null}
                <div className="travel_top_banner">
                    <div className="banner_inner main_inner">
                        <div className="banner_inner_info">
                            <span className="scoredream-500 default_text">날짜 : <span className="scoredream-500 grey_text">{dateList && dateList[0].date + " ~ " + dateList[dateList.length - 1].date}</span></span>
                            <span className="scoredream-500 default_text">대표지역 : <span className="scoredream-500 grey_text">{dateList && dateList[0].destination}</span></span>
                            <span className="scoredream-500 default_text">인원 : <span className="scoredream-500 grey_text">{dateList && dateList[0].people}명</span></span>
                        </div>
                        <div className="banner_inner_button">
                            <div className="banner_button_save">
                                <span className="scoredream-700 white_text">엑셀로 저장하기</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={!isHideList ? "travel_list_section travel_list_section_no_hide" : "travel_list_section travel_list_section_hide"}>
                    <div className="travel_list_box">
                        <div className="travel_list_box_section">
                            <div className="travel_list_box_menu">
                                <div className="travel_list_box_menu_top">
                                    <select className="scoredream-500 grey_text select_date" onChange={(event) => handleChangeDateSelect(event)} value={dateSelected}>
                                        {dateList.map((item, index) => (
                                            <option value={item.date} key={index}>
                                                {item.date}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="scoredream-500 grey_text current_clear_button" onClick={() => handleResetDateSelected()}>
                                        <GrPowerReset className="current_clear_icon"/>
                                        초기화하기
                                    </button>
                                </div>
                                <div className="travel_list_box_menu_bottom">
                                    {tabList.map((tab: string, index: number) => (
                                        <div key={index}>
                                            <button
                                                className={isTab === index ? "scoredream-500 gaemigul_guide tab_button" : "scoredream-500 grey_text tab_button"}
                                                onClick={() => {
                                                    setTab(index)
                                                    setAddList(false)
                                                }}>
                                                {tab}
                                            </button>
                                            {/*{index === tabList.length - 1 ? null : <span className="scoredream-500 grey_text tab_button">{">"}</span>}*/}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {!isListReady ? null : showTab()}
                        </div>
                    </div>
                    <div className="travel_list_button" onClick={() => {
                        setHideList(!isHideList)
                        setAddList(false)
                    }}>
                    </div>
                </div>
                {isAddList &&
                <TravelSearch
                    placeList={placeList}
                    searchList={searchList}
                    placeId={isAddPlaceId}
                    setCenter={(lat: number, lng: number) => map?.panTo(new kakao.maps.LatLng(lat, lng))}
                    setPlaceList={(place: string, lat: string, lng: string, address: string, place_icon: dropdownIconPlaceInterface, index: number) => addSearchList(place, lat, lng, address, place_icon, index)}
                    setSearchList={(data: searchListInterface[]) => setSearchList(data)}
                    setAddList={(status: boolean) => setAddList(status)}
                />}
                <Map
                    id="map"
                    center={{lat: 37.5547125, lng: 126.9707878}}
                    isPanto={true}
                    style={{
                        width: "1920px",
                        height: "866px",
                    }}
                    className={!isHideList ? "travel_map active" : "travel_map"}
                    draggable={isMapDraggable}
                    zoomable={isMapZoomable}
                    level={3}
                    onCreate={(map: kakao.maps.Map) => setMap(map)}
                >
                    {isTab === 0 && placeList && placeList.map((item, index) => (
                        <MapMarker
                            key={index}
                            position={{
                                lat: Number(item.lat),
                                lng: Number(item.lng)
                            }}
                            zIndex={60}
                            image={{
                                src: "https://raw.githubusercontent.com/gusgh00/gaemigul_guide_img/refs/heads/main/list_marker_" + index + ".png",
                                size: {
                                    width: 43,
                                    height: 64
                                }
                            }}
                            clickable={true}
                            onClick={() => {
                                map?.panTo(new kakao.maps.LatLng(Number(item.lat), Number(item.lng)))
                            }}
                            onMouseOver={() => {
                                setPlaceMarkerInfo(true)
                                setPlaceMarkerInfoId(item.id)
                            }}
                            onMouseOut={() => {
                                setPlaceMarkerInfo(false)
                                setPlaceMarkerInfoId(0)
                            }}
                        >
                            {isPlaceMarkerInfoId === item.id && isPlaceMarkerInfo &&
                                <div className="marker_info">
                                    <span className="scoredream-700 default_text place">{item.place}</span>
                                    <span className="scoredream-500 grey_text address">{item.address}</span>
                                </div>
                            }
                        </MapMarker>
                    ))}
                    {(isTab === 1 || isTab === 2) && placeList && placeList.map((item, index) => (
                        <MapMarker
                            key={index}
                            position={{
                                lat: Number(item.lat),
                                lng: Number(item.lng)
                            }}
                            image={{
                                src: "https://raw.githubusercontent.com/gusgh00/gaemigul_guide_img/refs/heads/main/place_marker_" + item.place_type + ".png",
                                size: {
                                    width: 43,
                                    height: 64
                                }
                            }}
                            clickable={true}
                            onClick={() => {
                                map?.panTo(new kakao.maps.LatLng(Number(item.lat), Number(item.lng)))
                            }}
                            onMouseOver={() => {
                                setPlaceMarkerInfo(true)
                                setPlaceMarkerInfoId(item.id)
                            }}
                            onMouseOut={() => {
                                setPlaceMarkerInfo(false)
                                setPlaceMarkerInfoId(0)
                            }}
                        >
                            {isPlaceMarkerInfoId === item.id && isPlaceMarkerInfo &&
                                <div className="marker_info">
                                    <span className="scoredream-700 default_text place">{item.place}</span>
                                    <span className="scoredream-500 grey_text address">{item.address}</span>
                                </div>
                            }
                        </MapMarker>
                    ))}
                    {isTab === 0 && searchList && searchList.map((item, index) => (
                        <MapMarker
                            key={index}
                            position={{
                                lat: Number(item.lat),
                                lng: Number(item.lng)
                            }}
                            image={{
                                src: "https://raw.githubusercontent.com/gusgh00/gaemigul_guide_img/refs/heads/main/search_list_marker.png",
                                size: {
                                    width: 43,
                                    height: 64
                                }
                            }}
                            clickable={true}
                            onClick={() => {
                                if (!!placeList && placeList?.length < 10) {
                                    map?.panTo(new kakao.maps.LatLng(Number(item.lat), Number(item.lng)))
                                    addSearchList(item.place, item.lat, item.lng, item.address, item.place_icon, index)
                                }
                            }}
                            onMouseOver={() => {
                                setSearchMarkerInfo(true)
                                setSearchMarkerInfoId(item.id)
                            }}
                            onMouseOut={() => {
                                setSearchMarkerInfo(false)
                                setSearchMarkerInfoId(0)
                            }}
                        >
                            {isSearchMarkerInfoId === item.id && isSearchMarkerInfo &&
                                <div className="marker_info">
                                    <span className="scoredream-700 default_text place">{item.place}</span>
                                    <span className="scoredream-500 grey_text address">{item.address}</span>
                                </div>
                            }
                        </MapMarker>
                    ))}
                    {(isTab === 1 || isTab === 2) && placeList && placeList.map((item, index) => (
                        item.vehicle_type === 3 ?
                            item.public_path.map((value, idx) => (
                                <Polyline
                                    key={idx}
                                    path={[value.path]}
                                    strokeWeight={value.type === 0 ? 7 : 5} // 선의 두께 입니다
                                    strokeColor={value.path_color} // 선의 색깔입니다
                                    strokeOpacity={1} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                                    strokeStyle={value.type === 0 ? "shortdashdot" : "solid"} // 선의 스타일입니다
                                >
                                </Polyline>
                            )) :
                            <Polyline
                                key={index}
                                path={[item.path]}
                                strokeWeight={5} // 선의 두께 입니다
                                strokeColor={item.path_color} // 선의 색깔입니다
                                strokeOpacity={1} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                                strokeStyle={"solid"} // 선의 스타일입니다
                            >
                            </Polyline>
                    ))}
                </Map>
            </div>
        </>
    )
}

export default Travel