'use client'
import {Map, MapMarker, Polyline} from "react-kakao-maps-sdk";
import React, {useEffect, useRef, useState} from "react";
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
import axios from "axios";
import {UseFloatingOptions} from "@floating-ui/react";
require('react-datepicker/dist/react-datepicker.css')

const Travel = () => {
    type OptionsWithoutMiddleware = Omit<UseFloatingOptions, 'middleware'>;
    const options: OptionsWithoutMiddleware = {strategy: "fixed"} as OptionsWithoutMiddleware
    interface placeListInterface {
        id: number,
        place: string,
        lat: string,
        lng: string,
        address: string,
        place_type: number,
        place_name: string,
        place_icon: JSX.Element,
        stay_time: Date | null | undefined
        stay_amount: string,
        vehicle_type: number,
        vehicle_icon: JSX.Element,
        vehicle_name: string,
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

    interface dropdownIconPlaceInterface {
        place_type: number,
        place_icon: JSX.Element,
        place_name: string
    }

    interface dropdownIconVehicleInterface {
        vehicle_type: number,
        vehicle_icon: JSX.Element,
        vehicle_name: string,
        path_color: string
    }

    const initialPlaceLists: placeListInterface[] = [
        {
            id: 1,
            place: "서울역",
            lat: "37.5547125",
            lng: "126.9707878",
            address: "서울특별시 용산구 한강대로 405",
            place_type: 0,
            place_name: "default",
            place_icon: <MdPlace className="select_place_icon"/>,
            stay_time: new Date(new Date().setHours(0,0)),
            stay_amount: "0",
            vehicle_type: 0,
            vehicle_icon: <FaQuestion className="select_vehicle_icon"/>,
            vehicle_name: "default",
            move_time: new Date(new Date().setHours(0,0)),
            move_amount: "0",
            path_hide: true,
            start_time: new Date(new Date().setHours(0,0)),
            end_time: new Date(new Date().setHours(0,0)),
            path: [],
            path_color: "#3c3c3c",
        },
    ];

    const dropdownIconPlace: dropdownIconPlaceInterface[] = [
        {
            place_type: 0,
            place_icon: <MdPlace className="select_place_icon"/>,
            place_name: "default"
        },
        {
            place_type: 1,
            place_icon: <FaBed className="select_place_icon"/>,
            place_name: "hotel"
        },
        {
            place_type: 2,
            place_icon: <IoRestaurant className="select_place_icon"/>,
            place_name: "restaurant"
        },
        {
            place_type: 3,
            place_icon: <MdMuseum className="select_place_icon"/>,
            place_name: "museum"
        },
        {
            place_type: 4,
            place_icon: <TbBeach className="select_place_icon"/>,
            place_name: "leisure"
        },
        {
            place_type: 5,
            place_icon: <MdForest className="select_place_icon"/>,
            place_name: "rest"
        },
        {
            place_type: 6,
            place_icon: <FaShoppingCart className="select_place_icon"/>,
            place_name: "shopping"
        },
    ]
    const dropdownIconVehicle: dropdownIconVehicleInterface[] = [
        {
            vehicle_type: 0,
            vehicle_icon: <FaQuestion className="select_vehicle_icon"/>,
            vehicle_name: "default",
            path_color: "#3c3c3c",
        },
        {
            vehicle_type: 1,
            vehicle_icon: <FaWalking className="select_vehicle_icon"/>,
            vehicle_name: "walk",
            path_color: "#7430ec",
        },
        {
            vehicle_type: 2,
            vehicle_icon: <FaCar className="select_vehicle_icon"/>,
            vehicle_name: "car",
            path_color: "#3f8ec7",
        },
        {
            vehicle_type: 3,
            vehicle_icon: <FaBus className="select_vehicle_icon"/>,
            vehicle_name: "bus",
            path_color: "#5bb025",
        },
        {
            vehicle_type: 4,
            vehicle_icon: <FaBicycle className="select_vehicle_icon"/>,
            vehicle_name: "cycle",
            path_color: "#c71365",
        },
    ]

    const [isCenter, setCenter] = useState({lat: 37.5547125, lng: 126.9707878})

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

    const placeRef = useRef(null);
    const vehicleRef = useRef(null);

    const [placeTab, setPlaceTab] = useState<dropdownIconPlaceInterface[]>(dropdownIconPlace)
    const [isChangePlaceTab, setChangePlaceTab] = useState({place_type: 0, item_id: 0, status: false})

    const [vehicleTab, setVehicleTab] = useState<dropdownIconVehicleInterface[]>(dropdownIconVehicle)
    const [isChangeVehicleTab, setChangeVehicleTab] = useState({vehicle_type: 0, item_id: 0, status: false})

    const [startTime, setStartTime] = useState<Date | null | undefined>(new Date(new Date().setHours(0,0)))

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

    const changePlaceTypeTab = (id: number, type: number) => {
        const tempPlace = placeTab
        setPlaceTab([
            tempPlace.filter(item => item.place_type === type)[0],
            ...tempPlace.filter(item => item.place_type !== type)
        ])
        setChangePlaceTab({place_type: type, item_id: id, status: true})
        setChangeVehicleTab({vehicle_type: 0, item_id: 0, status: false})
    }

    const changePlaceType = (id: number, type: number, name: string, icon: JSX.Element) => {
        setPlaceList(placeList.map(item => {
            if (item.id === id) {
                return { ...item,
                    place_icon: icon,
                    place_type: type,
                    place_name: name
                }
            } else {
                return item
            }
        }))
        setChangePlaceTab({place_type: 0, item_id: 0, status: false})
    }

    const changeVehicleTypeTab = (id: number, type: number) => {
        const tempVehicle = vehicleTab
        setVehicleTab([
            tempVehicle.filter(item => item.vehicle_type === type)[0],
            ...tempVehicle.filter(item => item.vehicle_type !== type)
        ])
        setChangeVehicleTab({vehicle_type: type, item_id: id, status: true})
        setChangePlaceTab({place_type: 0, item_id: 0, status: false})
    }

    const changeVehicleType = (id: number, type: number, name: string, icon: JSX.Element, color: string) => {
        setPlaceList(placeList.map(item => {
            if (item.id === id) {
                return { ...item,
                    vehicle_icon: icon,
                    vehicle_type: type,
                    vehicle_name: name,
                    path_color: color,
                    path: []
                }
            } else {
                return item
            }
        }))
        setChangeVehicleTab({vehicle_type: 0, item_id: 0, status: false})
    }

    // const handleClickOutSide = (event) => {
    //     if (placeRef.current && !placeRef.current.contains(event.target)) {
    //         setChangePlaceTab({place_type: 0, item_id: 0, status: false})
    //     }
    //
    //     if (vehicleRef.current && !vehicleRef.current.contains(event.target)) {
    //         setChangeVehicleTab({vehicle_type: 0, item_id: 0, status: false})
    //     }
    // }
    //
    // useEffect(() => {
    //     document.addEventListener('mousedown', handleClickOutSide)
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutSide)
    //     }
    // }, []);

    const changeSearchValue = (value: string) => {
        setSearchValue(value)
    }

    const getRandomCode = () => {
        const categoryCodeArr = [
            // "" as kakao.maps.CategoryCode, //코드 미부여
            "AD5" as kakao.maps.CategoryCode, //숙박
            "CS2" as kakao.maps.CategoryCode, //편의점
            "MT1" as kakao.maps.CategoryCode, //대형마트
            "PK6" as kakao.maps.CategoryCode, //주차장
            "OL7" as kakao.maps.CategoryCode, //주유소
            "CT1" as kakao.maps.CategoryCode, //문화시설
            "AT4" as kakao.maps.CategoryCode, //관광명소
            "FD6" as kakao.maps.CategoryCode, //음식점
            "CE7" as kakao.maps.CategoryCode //카페
        ]
        const defaultPbtArr = [12, 11, 11, 11, 11, 11, 11, 11, 11]
        const carPbtArr = [10, 0, 10, 20, 20, 10, 10, 10, 10]
        const cyclePbtArr = [10, 30, 0, 12, 0, 12, 12, 12, 12]
        const BusPbtArr = [0, 10, 10, 0, 0, 20, 20, 20, 20]
        const WalkingPbtArr = [0, 10, 10, 0, 0, 20, 20, 20, 20]
        const lastPbtArr = [40, 20, 20, 10, 0, 0, 0, 10, 0]

        /*기본 (default), 도보, 자가용, 대중교통, 자전거*/
        /*기본 (default), 숙박, 맛집, 관람, 레저, 쉼터, 쇼핑*/
        const currentPlace = placeList.find(item => item.id === isAddPlaceId)

        const weights: { [key: string]: number } = {};
        categoryCodeArr.forEach((category, index) => {
            weights[category] = carPbtArr[index];
        });

        let res: kakao.maps.CategoryCode[] = []
        for (let j = 0; j < 10; j++) {
            let randNum = Math.random() * 100
            let cumulativeWeight = 0

            for (const category of categoryCodeArr) {
                cumulativeWeight += weights[category];
                if (randNum < cumulativeWeight) {
                    return category
                }
            }
        }
        return "AD5"
    }

    const setRecommendList = () => {
        const place = new kakao.maps.services.Places()
        const options = {
            size: 10,
            page: 1,
            location: new kakao.maps.LatLng(Number(placeList.find(item => item.id === isAddPlaceId)?.lat), Number(placeList.find(item => item.id === isAddPlaceId)?.lng)),
            sort: kakao.maps.services.SortBy.DISTANCE,
            radius: 1000,
        }

        const code = getRandomCode()
        place.categorySearch(code as kakao.maps.CategoryCode, (data, status, pagination) => {
            if (status === kakao.maps.services.Status.OK) {
                let keywordSearchList: searchListInterface[] = []
                for (let i = 0; i < data.slice(0, 10).length; i++) {
                    keywordSearchList.push({
                        id: Number(data[i].id),
                        place: data[i].place_name,
                        lat: data[i].y,
                        lng: data[i].x,
                        address: data[i].address_name,
                        url: data[i].place_url,
                        img: "",
                        social: "카카오맵",
                    })
                }
                setSearchList(keywordSearchList)
            }
        }, options)
    }

    const setKeywordList = () => {
        const place = new kakao.maps.services.Places()
        const options = {
            size: 10,
            page: 1,
            // location: new kakao.maps.LatLng(Number(placeList.find(item => item.id === isAddPlaceId)?.lat), Number(placeList.find(item => item.id === isAddPlaceId)?.lng)),
            // sort: kakao.maps.services.SortBy.DISTANCE,
            // radius: 20000,
        }

        place.keywordSearch(searchValue, (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
                let keywordSearchList: searchListInterface[] = []

                for (let i = 0; i < data.slice(0, 10).length; i++) {
                    keywordSearchList.push({
                        id: Number(data[i].id),
                        place: data[i].place_name,
                        lat: data[i].y,
                        lng: data[i].x,
                        address: data[i].address_name,
                        url: data[i].place_url,
                        img: "",
                        social: "카카오맵",
                    })
                }

                setSearchList(keywordSearchList)
            }
        }, options)
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
            place_name: "default",
            place_icon: <MdPlace className="select_place_icon"/>,
            stay_time: new Date(new Date().setHours(0, 0)),
            stay_amount: "0",
            vehicle_type: 0,
            vehicle_icon: <FaQuestion className="select_vehicle_icon"/>,
            vehicle_name: "default",
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

            const url = process.env.NEXT_PUBLIC_MAPBOX_URL
            let endPlace = placeList.find((val, valIndex) => valIndex == i + 1)
            let startPosition = placeList[i].lng + "," + placeList[i].lat
            let endPosition = endPlace?.lng + "," + endPlace?.lat

            await axios.get(url + profiles + startPosition + ";" + endPosition, {
                params: {
                    geometries: "geojson",
                    access_token: process.env.NEXT_PUBLIC_MAPBOX_KEY
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

    const removeDirectionGeometry = () => {
        let items = [...placeList];
        for (let i = 0; i < placeList.length; i++) {
            items[i].path = []
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
                                                        onClick={() => setCenter({lat: Number(item.lat), lng: Number(item.lng)})}
                                                    >
                                                        <div
                                                            className="drag_handler_div"
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <RxDragHandleHorizontal className="drag_handler_icon"/>
                                                        </div>
                                                        <div className="place_list_div">
                                                            <span className="scoredream-700 default_text place">{"[" + (index + 1) + "] "}{item.place}</span>
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
                                                            setCenter({lat: Number(item.lat), lng: Number(item.lng)})
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
                            <div className="time_input_div">
                                <DatePicker
                                    selected={startTime}
                                    onChange={(date: Date | null) => date && setStartTime(date)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    showTimeCaption={false}
                                    timeIntervals={5}
                                    dateFormat="HH:mm"
                                    timeFormat="HH:mm"
                                    className="scoredream-700 default_text stay_time"
                                    popperProps={options}
                                />
                            </div>
                        </div>
                    </div>
                    {placeList.map((item: any, index: number) => {
                        return (
                            <div key={index}>
                                <div
                                    className="place_list_section"
                                >
                                    {/*기본 (default), 숙박, 맛집, 관람, 레저, 쉼터, 쇼핑*/}
                                    <div className={"select_place_div " + item.place_name} onClick={() => changePlaceTypeTab(item.id, item.place_type)}>
                                        {item.place_icon}
                                    </div>
                                    <div className={isChangePlaceTab.status && item.id === isChangePlaceTab.item_id ? "select_place_tab" : "display_none"} ref={placeRef}>
                                        {placeTab.map((value, index) => (
                                            <div key={index} className={"select_place_div " + value.place_name + (value.place_type === item.place_type ? " active" : "")}
                                                 onClick={() => {
                                                     changePlaceType(item.id, value.place_type, value.place_name, value.place_icon)
                                                 }}
                                            >
                                                {value.place_icon}
                                            </div>
                                        ))}
                                    </div>
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
                                                popperProps={options}
                                            />
                                        </div>
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
                                                            popperProps={options}
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
                                                            popperProps={options}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="place_road_section"
                                        >
                                            {/*기본 (default), 도보, 자가용, 대중교통, 자전거*/}
                                            <div className={"select_vehicle_div " + item.vehicle_name} onClick={() => changeVehicleTypeTab(item.id, item.vehicle_type)}>
                                                {item.vehicle_icon}
                                            </div>
                                            <div className={isChangeVehicleTab.status && item.id === isChangeVehicleTab.item_id ? "select_vehicle_tab" : "display_none"} ref={vehicleRef} onClick={(e) => e.stopPropagation()}>
                                                {vehicleTab.map((value, index) => (
                                                    <div key={index} className={"select_vehicle_div " + value.vehicle_name + (value.vehicle_type === item.vehicle_type ? " active" : "")}
                                                         onClick={() => {
                                                             changeVehicleType(item.id, value.vehicle_type, value.vehicle_name, value.vehicle_icon, value.path_color)
                                                         }}
                                                    >
                                                        {value.vehicle_icon}
                                                    </div>
                                                ))}
                                            </div>
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
                                                        popperProps={options}
                                                    />
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
                            <input
                                type="text"
                                placeholder="검색할 키워드를 입력하세요."
                                className="scoredream-500 default_text keyword_input"
                                value={searchValue}
                                onChange={(event) => {changeSearchValue(event.target.value)}}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setKeywordList()
                                    }
                                }}
                            />
                        </div>
                        <button className="search_btn_keyword" onClick={() => setKeywordList()}>
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
                                <div className="item_img_div" onClick={() => {
                                    setCenter({lat: Number(item.lat), lng: Number(item.lng)})
                                }}>
                                    <span className="scoredream-700 default_text num">{index + 1}</span>
                                    {/*<Image width={408} height={306} src={null} alt={item.place} className="item_img"/>*/}
                                </div>
                                <div className="item_info_div" onClick={() => {
                                    setCenter({lat: Number(item.lat), lng: Number(item.lng)})
                                }}>
                                    <span className="scoredream-700 default_text place">{item.place}</span>
                                    <span className="scoredream-500 grey_text address">{item.address}</span>
                                    <Link href={item.url} target="_blank" className="to_url">
                                        <span className="scoredream-500 gaemigul_guide to_url_span">{item.social}(으)로 바로가기{" >"}</span>
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
                    center={isCenter}
                    isPanto={true}
                    style={{
                        width: "1920px",
                        height: "866px",
                    }}
                    className={!isHideList ? "travel_map active" : "travel_map"}
                    level={3}
                >
                    {isTab === 0 && placeList && placeList.map((item, index) => (
                        <MapMarker
                            key={index}
                            position={{
                                lat: Number(item.lat),
                                lng: Number(item.lng)
                            }}
                            image={{
                                src: "https://raw.githubusercontent.com/SsapTPandSsapFJ/gaemigul_guide_img/refs/heads/main/list_marker_" + index + ".png",
                                size: {
                                    width: 43,
                                    height: 64
                                }
                            }}
                            clickable={false}
                            onMouseOver={() => setMarkerInfo(true)}
                            onMouseOut={() => setMarkerInfo(false)}
                        >
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

                    {isTab === 0 && searchList && searchList.map((item, index) => (
                        <MapMarker
                            key={index}
                            position={{
                                lat: Number(item.lat),
                                lng: Number(item.lng)
                            }}
                            image={{
                                src: "https://raw.githubusercontent.com/SsapTPandSsapFJ/gaemigul_guide_img/refs/heads/main/search_list_marker.png",
                                size: {
                                    width: 43,
                                    height: 64
                                }
                            }}
                            clickable={true}
                            onMouseOver={() => setMarkerInfo(true)}
                            onMouseOut={() => setMarkerInfo(false)}
                            onClick={() => {
                                if (!!placeList && placeList?.length < 10) addSearchList(item)
                            }}
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