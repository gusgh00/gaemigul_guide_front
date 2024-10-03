'use client'
import {Map} from "react-kakao-maps-sdk";
import React, {useEffect, useState} from "react";
import {
    DragDropContext,
    Draggable, DraggableProvided, DraggableStateSnapshot,
    Droppable,
    DroppableProvided,
    DroppableStateSnapshot,
    DropResult
} from "@hello-pangea/dnd";
import { RxDragHandleHorizontal } from "react-icons/rx";
import {FaArrowRight, FaBed, FaCar, FaQuestion, FaShoppingCart, FaWalking} from "react-icons/fa";
import {IoRestaurant} from "react-icons/io5";
import {
    MdClose,
    MdForest,
    MdMuseum,
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
    MdPlace
} from "react-icons/md";
import {TbBeach} from "react-icons/tb";
import DatePicker from "react-datepicker";
import {GrPowerReset} from "react-icons/gr";
import {FaBus, FaRegCirclePlay, FaRegCircleStop} from "react-icons/fa6";
require('react-datepicker/dist/react-datepicker.css')

const Travel = () => {
    interface placeListInterface {
        id: number,
        place: string,
        lat: string,
        lng: string,
        address: string,
        place_type: number,
        stay_time: Date | null | undefined
        stay_amount: string,
        vehicle_type: number,
        move_time: Date | null | undefined,
        move_amount: string,
        path_hide: boolean,
        start_time: Date | null | undefined,
        end_time: Date | null | undefined,
    }

    const initialLists: placeListInterface[] = [
        {
            id: 1,
            place: "서울역",
            lat: "37.5547125",
            lng: "126.9707878",
            address: "서울특별시 용산구 한강대로 405",
            place_type: 0,
            stay_time: new Date(new Date().setHours(0,0)),
            stay_amount: "0",
            vehicle_type: 0,
            move_time: new Date(new Date().setHours(0,0)),
            move_amount: "0",
            path_hide: true,
            start_time: new Date(new Date().setHours(0,0)),
            end_time: new Date(new Date().setHours(0,0)),
        },
        {
            id: 2,
            place: "영등포역",
            lat: "37.5154133",
            lng: "126.9071288",
            address: "서울특별시 영등포구 영등포본동",
            place_type: 1,
            stay_time: new Date(new Date().setHours(0,0)),
            stay_amount: "0",
            vehicle_type: 1,
            move_time: new Date(new Date().setHours(0,0)),
            move_amount: "0",
            path_hide: true,
            start_time: new Date(new Date().setHours(0,0)),
            end_time: new Date(new Date().setHours(0,0)),
        },
        {
            id: 3,
            place: "홍대입구역",
            lat: "37.557527",
            lng: "126.9244669",
            address: "서울특별시 마포구 양화로 지하 160",
            place_type: 2,
            stay_time: new Date(new Date().setHours(0,0)),
            stay_amount: "0",
            vehicle_type: 2,
            move_time: new Date(new Date().setHours(0,0)),
            move_amount: "0",
            path_hide: true,
            start_time: new Date(new Date().setHours(0,0)),
            end_time: new Date(new Date().setHours(0,0)),
        },
        {
            id: 4,
            place: "홍익대학교 서울캠퍼스",
            lat: "37.5507563",
            lng: "126.9254901",
            address: "서울특별시 마포구 와우산로 94",
            place_type: 3,
            stay_time: new Date(new Date().setHours(0,0)),
            stay_amount: "0",
            vehicle_type: 3,
            move_time: new Date(new Date().setHours(0,0)),
            move_amount: "0",
            path_hide: true,
            start_time: new Date(new Date().setHours(0,0)),
            end_time: new Date(new Date().setHours(0,0)),
        },
        {
            id: 5,
            place: "젠틀몬스터 홍대 플래그십스토어",
            lat: "37.5507563",
            lng: "126.9254901",
            address: "서울특별시 마포구 독막로7길 54",
            place_type: 4,
            stay_time: new Date(new Date().setHours(0,0)),
            stay_amount: "0",
            vehicle_type: 0,
            move_time: new Date(new Date().setHours(0,0)),
            move_amount: "0",
            path_hide: true,
            start_time: new Date(new Date().setHours(0,0)),
            end_time: new Date(new Date().setHours(0,0)),
        },
        {
            id: 6,
            place: "63빌딩",
            lat: "37.5197159",
            lng: "126.9401255",
            address: "서울특별시 영등포구 63로 50",
            place_type: 5,
            stay_time: new Date(new Date().setHours(0,0)),
            stay_amount: "0",
            vehicle_type: 0,
            move_time: new Date(new Date().setHours(0,0)),
            move_amount: "0",
            path_hide: true,
            start_time: new Date(new Date().setHours(0,0)),
            end_time: new Date(new Date().setHours(0,0)),
        },
        {
            id: 7,
            place: "탬버린즈 신사 플래그십스토어",
            lat: "37.5206264",
            lng: "127.0220599",
            address: "서울특별시 강남구 압구정로10길 44",
            place_type: 6,
            stay_time: new Date(new Date().setHours(0,0)),
            stay_amount: "0",
            vehicle_type: 0,
            move_time: new Date(new Date().setHours(0,0)),
            move_amount: "0",
            path_hide: true,
            start_time: new Date(new Date().setHours(0,0)),
            end_time: new Date(new Date().setHours(0,0)),
        },
    ];

    const [isHideList, setHideList] = useState(false)
    const [isListReady, setListReady] = useState(false)
    const [placeList, setPlaceList] = useState<placeListInterface[]>(initialLists);

    const tabList = ['경유지 탐색', '경유지 상세', '최종 계획']
    const [isTab, setTab] = useState(0)

    const dateList = ["2024년 10월 12일", "2024년 10월 13일", "2024년 10월 14일", "2024년 10월 15일"]
    const [dateSelected, setDateSelected] = useState("2024년 10월 12일")

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

    const changePlaceMoveTime = (id: number, date: Date) => {
        setPlaceList(placeList.map(item => {
            if (item.id === id) {
                return { ...item, move_time: date }
            } else {
                return item
            }
        }))
    }

    const changePlaceStartTime = (id: number, date: Date) => {
        setPlaceList(placeList.map(item => {
            if (item.id === id) {
                return { ...item, start_time: date }
            } else {
                return item
            }
        }))
    }

    const changePlaceEndTime = (id: number, date: Date) => {
        setPlaceList(placeList.map(item => {
            if (item.id === id) {
                return { ...item, end_time: date }
            } else {
                return item
            }
        }))
    }

    const changePlaceStayAmount = (id: number, amount: string) => {
        setPlaceList(placeList.map(item => {
            if (item.id === id) {
                return { ...item, stay_amount: amount }
            } else {
                return item
            }
        }))
    }

    const changePlaceMoveAmount = (id: number, amount: string) => {
        setPlaceList(placeList.map(item => {
            if (item.id === id) {
                return { ...item, move_amount: amount }
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
                                                        <div className="place_list_div">
                                                            <span className="scoredream-700 default_text place">{item.place}</span>
                                                            <span className="scoredream-500 grey_text address">{item.address}</span>
                                                        </div>
                                                        <div className="close_div">
                                                            <MdClose className="close_icon" onClick={() => closePlaceList(index)}/>
                                                        </div>
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
                return <div
                    className="all_road_section">
                    {placeList.map((item: any, index: number) => {
                        return (
                            <div key={index}>
                                <div
                                    className="place_list_section"
                                >
                                    {/*기본 (default), 숙박, 맛집, 관람, 레저, 쉼터, 쇼핑*/}
                                    {item.place_type === 0 &&
                                        <div className="select_place_div default"><MdPlace className="select_place_icon"/>
                                        </div>}
                                    {item.place_type === 1 &&
                                        <div className="select_place_div hotel"><FaBed className="select_place_icon"/>
                                        </div>}
                                    {item.place_type === 2 && <div className="select_place_div restaurant"><IoRestaurant
                                        className="select_place_icon"/></div>}
                                    {item.place_type === 3 &&
                                        <div className="select_place_div museum"><MdMuseum className="select_place_icon"/>
                                        </div>}
                                    {item.place_type === 4 &&
                                        <div className="select_place_div leisure"><TbBeach className="select_place_icon"/>
                                        </div>}
                                    {item.place_type === 5 &&
                                        <div className="select_place_div rest"><MdForest className="select_place_icon"/>
                                        </div>}
                                    {item.place_type === 6 && <div className="select_place_div shopping"><FaShoppingCart
                                        className="select_place_icon"/></div>}
                                    <div className="place_list_div">
                                        <span className="scoredream-700 default_text place">{item.place}</span>
                                        <span className="scoredream-500 grey_text address">{item.address}</span>
                                    </div>
                                    <div className="place_amount_div">
                                        <span className="scoredream-700 grey_text amount_type">이용 비용</span>
                                        <div className="amount_input_div">
                                            {/*<DatePicker*/}
                                            {/*    selected={item.stay_time}*/}
                                            {/*    onChange={(date: Date | null) => date && changePlaceStayTime(item.id, date)}*/}
                                            {/*    showTimeSelect*/}
                                            {/*    showTimeSelectOnly*/}
                                            {/*    showTimeCaption={false}*/}
                                            {/*    timeIntervals={5}*/}
                                            {/*    dateFormat="HH:mm"*/}
                                            {/*    timeFormat="HH:mm"*/}
                                            {/*    className="scoredream-700 default_text amount"*/}
                                            {/*/>*/}
                                            <input type="text" maxLength={4} className="scoredream-700 default_text amount" value={item.stay_amount} onChange={(event) => changePlaceStayAmount(item.id, event.target.value)}/>
                                            <span className="scoredream-700 grey_text amount_unit">만원</span>
                                        </div>
                                    </div>
                                    <div className="place_stay_time_div">
                                        <span className="scoredream-700 grey_text time_type">머무는 시간</span>
                                        <div className="time_input_div">
                                            <DatePicker
                                                selected={item.stay_time}
                                                onChange={(date: Date | null) => date && changePlaceStayTime(item.id, date)}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                showTimeCaption={false}
                                                timeIntervals={5}
                                                dateFormat="HH:mm"
                                                timeFormat="HH:mm"
                                                className="scoredream-700 default_text stay_time"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {index === placeList.length - 1 ? null :
                                    <>
                                        <div
                                            className="place_road_section"
                                        >
                                            {/*기본 (default), 도보, 자가용, 대중교통*/}
                                            {item.vehicle_type === 0 &&
                                                <div className="select_place_div default"><FaQuestion className="select_place_icon"/>
                                                </div>}
                                            {item.vehicle_type === 1 &&
                                                <div className="select_place_div walk"><FaWalking className="select_place_icon"/>
                                                </div>}
                                            {item.vehicle_type === 2 && <div className="select_place_div car"><FaCar
                                                className="select_place_icon"/></div>}
                                            {item.vehicle_type === 3 &&
                                                <div className="select_place_div bus"><FaBus className="select_place_icon"/>
                                                </div>}
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
                                                    <DatePicker
                                                        selected={item.move_time}
                                                        onChange={(date: Date | null) => date && changePlaceMoveTime(item.id, date)}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        showTimeCaption={false}
                                                        timeIntervals={5}
                                                        dateFormat="HH:mm"
                                                        timeFormat="HH:mm"
                                                        className="scoredream-700 default_text move_time"
                                                    />
                                                </div>
                                            </div>
                                        </div>
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
                                                        <DatePicker
                                                            selected={item.start_time}
                                                            onChange={(date: Date | null) => date && changePlaceStartTime(item.id, date)}
                                                            showTimeSelect
                                                            showTimeSelectOnly
                                                            showTimeCaption={false}
                                                            timeIntervals={5}
                                                            dateFormat="HH:mm"
                                                            timeFormat="HH:mm"
                                                            className="scoredream-700 default_text move_time"
                                                        />
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
                                                        <DatePicker
                                                            selected={item.end_time}
                                                            onChange={(date: Date | null) => date && changePlaceEndTime(item.id, date)}
                                                            showTimeSelect
                                                            showTimeSelectOnly
                                                            showTimeCaption={false}
                                                            timeIntervals={5}
                                                            dateFormat="HH:mm"
                                                            timeFormat="HH:mm"
                                                            className="scoredream-700 default_text move_time"
                                                        />
                                                    </div>
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
            case 3:
                return <></>
        }
    }

    const handleChangeDateSelect= (e: React.ChangeEvent<any>) => {
        setDateSelected(e.target.value);
    }

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
                            {/*<div className="banner_button_clear">*/}
                            {/*    <span className="scoredream-700 white_text">처음부터</span>*/}
                            {/*</div>*/}
                            <div className="banner_button_save">
                                <span className="scoredream-700 white_text">저장하기</span>
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
                                        {dateList.map((item) => (
                                            <option value={item} key={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="scoredream-500 grey_text current_clear_button">
                                        <GrPowerReset className="current_clear_icon"/>
                                        초기화하기
                                    </button>
                                </div>
                                <div className="travel_list_box_menu_bottom">
                                    {tabList.map((tab: string, index: number) => (
                                        <>
                                            <button
                                                key={index}
                                                className={isTab === index ? "scoredream-500 gaemigul_guide tab_button" : "scoredream-500 grey_text tab_button"}
                                                onClick={() => setTab(index)}>
                                                {tab}
                                            </button>
                                            {index === tabList.length - 1 ? null : <span key={index} className="scoredream-500 grey_text tab_button">{">"}</span>}
                                        </>
                                    ))}
                                </div>
                            </div>
                            {!isListReady ? null : showTab()}
                            <div className="travel_list_box_handle">
                                <div className="travel_list_box_handle_top">
                                    <select className="scoredream-500 grey_text select_date" onChange={(event) => handleChangeDateSelect(event)} value={dateSelected}>
                                        {dateList.map((item) => (
                                            <option value={item} key={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="scoredream-500 grey_text current_clear_button">
                                        <GrPowerReset className="current_clear_icon"/>
                                        초기화하기
                                    </button>
                                </div>
                                <div className="travel_list_box_handle_bottom">
                                    {tabList.map((tab: string, index: number) => (
                                        <>
                                            <button
                                                key={index}
                                                className={isTab === index ? "scoredream-500 gaemigul_guide tab_button" : "scoredream-500 grey_text tab_button"}
                                                onClick={() => setTab(index)}>
                                                {tab}
                                            </button>
                                            {index === tabList.length - 1 ? null : <span key={index} className="scoredream-500 grey_text tab_button">{">"}</span>}
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
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