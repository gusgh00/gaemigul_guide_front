'use client'
import {Map, MapMarker, Polyline} from "react-kakao-maps-sdk";
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
import {
    FaArrowRight,
    FaBed, FaBicycle,
    FaCar,
    FaPlus,
    FaQuestion,
    FaSearch,
    FaShoppingCart,
    FaWalking
} from "react-icons/fa";
import {IoRestaurant} from "react-icons/io5";
import {
    MdAutoAwesome,
    MdClose,
    MdForest,
    MdMuseum,
    MdOutlineKeyboardArrowDown,
    MdPlace
} from "react-icons/md";
import {TbBeach} from "react-icons/tb";
import DatePicker from "react-datepicker";
import {GrPowerReset} from "react-icons/gr";
import {FaBus, FaRegCirclePlay, FaRegCircleStop} from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
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
        path: placeListPath[],
        path_color: string
    }

    interface placeListPath {
        lat: number,
        lng: number,
    }

    interface searchListInterface {
        id: number,
        place: string,
        lat: string,
        lng: string,
        address: string,
        url: string,
        img: string,
        social: string,
    }

    const initialPlaceLists: placeListInterface[] = [
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
            path: [],
            path_color: "#3c3c3c",
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
            path: [],
            path_color: "#7430ec",
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
            path: [],
            path_color: "#3f8ec7",
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
            vehicle_type: 4,
            move_time: new Date(new Date().setHours(0,0)),
            move_amount: "0",
            path_hide: true,
            start_time: new Date(new Date().setHours(0,0)),
            end_time: new Date(new Date().setHours(0,0)),
            path: [],
            path_color: "#c71365",
        },
        {
            id: 5,
            place: "젠틀몬스터 홍대 플래그십스토어",
            lat: "37.5499122",
            lng: "126.9200131",
            address: "서울특별시 마포구 독막로7길 54",
            place_type: 4,
            stay_time: new Date(new Date().setHours(0,0)),
            stay_amount: "0",
            vehicle_type: 3,
            move_time: new Date(new Date().setHours(0,0)),
            move_amount: "0",
            path_hide: true,
            start_time: new Date(new Date().setHours(0,0)),
            end_time: new Date(new Date().setHours(0,0)),
            path: [],
            path_color: "#5bb025",
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
            path: [],
            path_color: "#3c3c3c",
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
            path: [],
            path_color: "#3c3c3c",
        },
    ];

    const initialSearchLists: searchListInterface[] = [
        {
            id: 1,
            place: "서울역",
            lat: "37.5547125",
            lng: "126.9707878",
            address: "서울특별시 용산구 한강대로 405",
            url: "https://maps.app.goo.gl/eDdTwrz1WTB5jXdZ6",
            img: "https://lh5.googleusercontent.com/p/AF1QipMXlIPe8PgREoMRvWB1DvLxO1-kHRQU_Fetj5Vr=w408-h306-k-no",
            social: "Google",
        },
        {
            id: 2,
            place: "영등포역",
            lat: "37.5154133",
            lng: "126.9071288",
            address: "서울특별시 영등포구 영등포본동",
            url: "https://maps.app.goo.gl/eDdTwrz1WTB5jXdZ6",
            img: "https://lh5.googleusercontent.com/p/AF1QipMXlIPe8PgREoMRvWB1DvLxO1-kHRQU_Fetj5Vr=w408-h306-k-no",
            social: "Google",
        },
        {
            id: 3,
            place: "홍대입구역",
            lat: "37.557527",
            lng: "126.9244669",
            address: "서울특별시 마포구 양화로 지하 160",
            url: "https://maps.app.goo.gl/eDdTwrz1WTB5jXdZ6",
            img: "https://lh5.googleusercontent.com/p/AF1QipMXlIPe8PgREoMRvWB1DvLxO1-kHRQU_Fetj5Vr=w408-h306-k-no",
            social: "Google",
        },
        {
            id: 4,
            place: "홍익대학교 서울캠퍼스",
            lat: "37.5507563",
            lng: "126.9254901",
            address: "서울특별시 마포구 와우산로 94",
            url: "https://maps.app.goo.gl/eDdTwrz1WTB5jXdZ6",
            img: "https://lh5.googleusercontent.com/p/AF1QipMXlIPe8PgREoMRvWB1DvLxO1-kHRQU_Fetj5Vr=w408-h306-k-no",
            social: "Google",
        },
        {
            id: 5,
            place: "젠틀몬스터 홍대 플래그십스토어",
            lat: "37.5499122",
            lng: "126.9200131",
            address: "서울특별시 마포구 독막로7길 54",
            url: "https://maps.app.goo.gl/eDdTwrz1WTB5jXdZ6",
            img: "https://lh5.googleusercontent.com/p/AF1QipMXlIPe8PgREoMRvWB1DvLxO1-kHRQU_Fetj5Vr=w408-h306-k-no",
            social: "Google",
        },
        {
            id: 6,
            place: "63빌딩",
            lat: "37.5197159",
            lng: "126.9401255",
            address: "서울특별시 영등포구 63로 50",
            url: "https://maps.app.goo.gl/eDdTwrz1WTB5jXdZ6",
            img: "https://lh5.googleusercontent.com/p/AF1QipMXlIPe8PgREoMRvWB1DvLxO1-kHRQU_Fetj5Vr=w408-h306-k-no",
            social: "Google",
        },
        {
            id: 7,
            place: "탬버린즈 신사 플래그십스토어",
            lat: "37.5206264",
            lng: "127.0220599",
            address: "서울특별시 강남구 압구정로10길 44",
            url: "https://maps.app.goo.gl/eDdTwrz1WTB5jXdZ6",
            img: "https://lh5.googleusercontent.com/p/AF1QipMXlIPe8PgREoMRvWB1DvLxO1-kHRQU_Fetj5Vr=w408-h306-k-no",
            social: "Google",
        },
    ];

    const [isAddList, setAddList] = useState(false)
    const [isAddPlaceId, setAddPlaceId] = useState(0)

    const [isHideList, setHideList] = useState(false)
    const [isListReady, setListReady] = useState(false)
    const [placeList, setPlaceList] = useState<placeListInterface[]>(initialPlaceLists);

    const tabList = ['경유지 탐색', '경유지 상세', '최종 계획']
    const [isTab, setTab] = useState(0)

    const dateList = ["2024년 10월 12일", "2024년 10월 13일", "2024년 10월 14일", "2024년 10월 15일"]
    const [dateSelected, setDateSelected] = useState("2024년 10월 12일")

    const [searchValue, setSearchValue] = useState("")
    const [searchList, setSearchList] = useState<searchListInterface[]>();

    const [isMarkerInfo, setMarkerInfo] = useState(false)

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

    const changeSearchValue = (value: string) => {
        setSearchValue(value)
    }

    const setRecommendList = () => {
        setSearchList(initialSearchLists)
    }

    const findMaxIdLocation = (locations: placeListInterface[]) => {
        return locations.reduce((max, location) => {
            return (location.id > max.id) ? location : max;
        }, locations[0]); // 초기값으로 첫 번째 요소를 사용
    };

    const addSearchList = (params: searchListInterface) => {
        const tempPlaceList = [...placeList]
        const frontPlaceIndex = placeList.findIndex(item => item.id === isAddPlaceId)
        const maxPlaceId = findMaxIdLocation(tempPlaceList).id
        const newPlaceItem: placeListInterface = {
            id: maxPlaceId + 1,
            place: params.place,
            lat: params.lat,
            lng: params.lng,
            address: params.address,
            place_type: 0,
            stay_time: new Date(new Date().setHours(0, 0)),
            stay_amount: "0",
            vehicle_type: 0,
            move_time: new Date(new Date().setHours(0, 0)),
            move_amount: "0",
            path_hide: true,
            start_time: new Date(new Date().setHours(0, 0)),
            end_time: new Date(new Date().setHours(0, 0)),
            path: [],
            path_color: "#CBCBCB",
        }
        tempPlaceList.splice(frontPlaceIndex + 1, 0, newPlaceItem)
        setPlaceList(tempPlaceList)
    }

    const changePlacePath = async (coordinates: any[], index: number) => {
        let paths: placeListPath[] = []
        for (let i = 0; i < coordinates.length; i++) {
            paths.push({
                lat: coordinates[i][1],
                lng: coordinates[i][0]
            })
        }

        const items = [...placeList];
        items[index].path = paths
        setPlaceList(items)
    }

    const getDirectionGeometry = async () => {
        for (let i = 0; i < placeList.length; i++) {
            let profiles = ""
            if (placeList[i].vehicle_type === 1) {
                profiles = "walking/"
            } else if (placeList[i].vehicle_type === 2) {
                profiles = "driving/"
            } else if (placeList[i].vehicle_type === 4) {
                profiles = "cycling/"
            } else {
                continue;
            }

            const url = "http://api.mapbox.com/directions/v5/mapbox/"
            let endPlace = placeList.find((val, valIndex) => valIndex == i + 1)
            let startPosition = placeList[i].lng + "," + placeList[i].lat
            let endPosition = endPlace?.lng + "," + endPlace?.lat

            await axios.get(url + profiles + startPosition + ";" + endPosition, {
                params: {
                    geometries: "geojson",
                    access_token: "pk.eyJ1IjoiZGJndXNnaDAwIiwiYSI6ImNtMXlvNHlrejAwNnIya3B3ZWR5cHpicGoifQ.S3A3ATP_E8YRx9LgiZ7W4A"
                }
            })
                .then(async response => {
                    if (response.data.code === "Ok") {
                        let coordinates: any[] = response.data.routes[0].geometry.coordinates
                        await changePlacePath(coordinates, i)
                    }
                })
        }
    }

    useEffect(() => {
        console.log(placeList[1].path)
    }, [placeList]);

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
                                                        <div className={placeList.length > 1 ? "close_div" : "display_none"}>
                                                            <MdClose className="close_icon" onClick={() => {
                                                                closePlaceList(index)
                                                                if (item.id === isAddPlaceId) {
                                                                    setAddList(false)
                                                                    setAddPlaceId(0)
                                                                    setSearchList([])
                                                                }
                                                            }}/>
                                                        </div>
                                                        {placeList.length >= 10 ? null :
                                                        <button className={isAddPlaceId === item.id && isAddList ? "add_button active" : "add_button"} onClick={() => {
                                                            setAddList(true)
                                                            setAddPlaceId(item.id)
                                                            setSearchList([])
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
                                            {/*기본 (default), 도보, 자가용, 대중교통, 자전거*/}
                                            {item.vehicle_type === 0 &&
                                                <div className="select_vehicle_div default"><FaQuestion className="select_vehicle_icon"/>
                                                </div>}
                                            {item.vehicle_type === 1 &&
                                                <div className="select_vehicle_div walk"><FaWalking className="select_vehicle_icon"/>
                                                </div>}
                                            {item.vehicle_type === 2 && <div className="select_vehicle_div car"><FaCar
                                                className="select_vehicle_icon"/></div>}
                                            {item.vehicle_type === 3 &&
                                                <div className="select_vehicle_div bus"><FaBus className="select_vehicle_icon"/>
                                                </div>}
                                            {item.vehicle_type === 4 &&
                                                <div className="select_vehicle_div cycle"><FaBicycle className="select_vehicle_icon"/>
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
                            <div className="banner_button_save" onClick={() => getDirectionGeometry()}>
                                {/*임시*/}
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
                                        <div key={index}>
                                            <button
                                                className={isTab === index ? "scoredream-500 gaemigul_guide tab_button" : "scoredream-500 grey_text tab_button"}
                                                onClick={() => {
                                                    setTab(index)
                                                    setAddList(false)
                                                    setAddPlaceId(0)
                                                    setSearchList([])
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
                        setAddPlaceId(0)
                        setSearchList([])
                    }}>
                    </div>
                </div>
                <div className={isAddList ? "travel_search_section" : "display_none"}>
                    <div className="search_button_div">
                        <div className="close_div">
                            <MdClose className="close_icon" onClick={() => {
                                setAddPlaceId(0)
                                setAddList(false)
                                setSearchList([])
                            }}/>
                        </div>
                        <div className="keyword_input_div">
                            <input type="text" placeholder="검색할 키워드를 입력하세요." className="scoredream-500 default_text keyword_input" value={searchValue} onChange={(event) => {changeSearchValue(event.target.value)}}/>
                        </div>
                        <button className="search_btn_keyword">
                            <FaSearch className="keyword_icon"/>
                            <span className="scoredream-500">키워드로 검색</span>
                        </button>
                        <button className="search_btn_recommend" onClick={() => setRecommendList()}>
                            <MdAutoAwesome className="recommend_icon"/>
                            <span className="scoredream-500">추천 장소</span>
                        </button>
                    </div>
                    <div className="search_list_div">
                        {!!searchList && searchList?.length > 0 ?
                        searchList?.map((item, index) => (
                            <div className="search_item_section" key={index}>
                                <div className="item_img_div">
                                    <Image width={408} height={306} src={item.img} alt={item.place} className="item_img"/>
                                </div>
                                <div className="item_info_div">
                                    <span className="scoredream-700 default_text place">{item.place}</span>
                                    <span className="scoredream-500 grey_text address">{item.address}</span>
                                    <Link href={item.url} target="_blank" className="to_url">
                                        <span className="scoredream-500 gaemigul_guide to_url_span">{item.social}로 바로가기{" >"}</span>
                                    </Link>
                                </div>
                                <div className="item_add_div">
                                    <FaPlus className={!!placeList && placeList?.length < 10 ? "item_add_button" : "item_add_button disabled"} onClick={() => {
                                        if (!!placeList && placeList?.length < 10) addSearchList(item)
                                    }}/>
                                </div>
                            </div>
                        )) :
                            <div className="search_list_nothing">
                                <span className="scoredream-700 grey_text">키워드를 검색하거나<br/>추천 장소를 찾아보세요.</span>
                            </div>
                        }
                    </div>
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
                >
                    {placeList && placeList.map((item, index) => (
                        <MapMarker
                            key={index}
                            position={{
                                lat: Number(item.lat),
                                lng: Number(item.lng)
                            }}
                            image={{
                                src: "https://raw.githubusercontent.com/SsapTPandSsapFJ/gaemigul_guide_img/refs/heads/main/place_marker_" + item.place_type + ".png",
                                size: {
                                    width: 43,
                                    height: 64
                                }
                            }}
                            clickable={true}
                            onMouseOver={() => setMarkerInfo(true)}
                            onMouseOut={() => setMarkerInfo(false)}
                        >
                        </MapMarker>
                    ))}

                    {isTab === 1 && placeList && placeList.map((item, index) => (
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