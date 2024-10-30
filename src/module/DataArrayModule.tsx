import {
    dateListInterface,
    dropdownIconPlaceInterface,
    dropdownIconVehicleInterface,
    placeListInterface
} from "@interface/TravelInterface";
import {MdForest, MdMuseum, MdPlace} from "react-icons/md";
import {FaBed, FaBicycle, FaCar, FaQuestion, FaShoppingCart, FaWalking} from "react-icons/fa";
import {FaBus} from "react-icons/fa6";
import {IoRestaurant} from "react-icons/io5";
import {TbBeach} from "react-icons/tb";
import React from "react";

export const busRouteType = [
    {
        "type": 1,
        "name": "일반",
        "color": "#ff8000"
    },
    {
        "type": 2,
        "name": "좌석",
        "color": "#3d5bab"
    },
    {
        "type": 3,
        "name": "마을버스",
        "color": "#5bb025"
    },
    {
        "type": 4,
        "name": "직행좌석",
        "color": "#F72f08"
    },
    {
        "type": 5,
        "name": "공항버스",
        "color": "#8b4513"
    },
    {
        "type": 6,
        "name": "간선급행",
        "color": "#6e2db9"
    },
    {
        "type": 10,
        "name": "외곽",
        "color": "#5bb025"
    },
    {
        "type": 11,
        "name": "간선",
        "color": "#3d5bab"
    },
    {
        "type": 12,
        "name": "지선",
        "color": "#5bb025"
    },
    {
        "type": 13,
        "name": "순환",
        "color": "#f99d1c"
    },
    {
        "type": 14,
        "name": "광역",
        "color": "#F72f08"
    },
    {
        "type": 15,
        "name": "급행",
        "color": "#6e2db9"
    },
    {
        "type": 16,
        "name": "관광버스",
        "color": "#F72f08"
    },
    {
        "type": 20,
        "name": "농어촌버스",
        "color": "#F72f08"
    },
    {
        "type": 22,
        "name": "경기도 시외형버스",
        "color": "#F72f08"
    },
    {
        "type": 26,
        "name": "급행간선",
        "color": "#6e2db9"
    }
]
export const subwayRouteType = [
    {
        "type": 1,
        "name": "수도권 1호선",
        "color": "#0052a4"
    },
    {
        "type": 2,
        "name": "수도권 2호선",
        "color": "#00a84d"
    },
    {
        "type": 3,
        "name": "수도권 3호선",
        "color": "#ef7c1c"
    },
    {
        "type": 4,
        "name": "수도권 4호선",
        "color": "#00a4e3"
    },
    {
        "type": 5,
        "name": "수도권 5호선",
        "color": "#996cac"
    },
    {
        "type": 6,
        "name": "수도권 6호선",
        "color": "#cd7c2f"
    },
    {
        "type": 7,
        "name": "수도권 7호선",
        "color": "#747f00"
    },
    {
        "type": 8,
        "name": "수도권 8호선",
        "color": "#e6186c"
    },
    {
        "type": 9,
        "name": "수도권 9호선",
        "color": "#bdb092"
    },
    {
        "type": 91,
        "name": "GTX-A",
        "color": "#9a6292"
    },
    {
        "type": 101,
        "name": "공항철도",
        "color": "#0090d2"
    },
    {
        "type": 102,
        "name": "자기부상철도",
        "color": "#ffcd12"
    },
    {
        "type": 104,
        "name": "경의중앙선",
        "color": "#77c4a3"
    },
    {
        "type": 107,
        "name": "에버라인",
        "color": "#56ab2d"
    },
    {
        "type": 108,
        "name": "경춘선",
        "color": "#178c72"
    },
    {
        "type": 109,
        "name": "신분당선",
        "color": "#d4003b"
    },
    {
        "type": 110,
        "name": "의정부경전철",
        "color": "#fb8100"
    },
    {
        "type": 112,
        "name": "경강선",
        "color": "#0054a6"
    },
    {
        "type": 113,
        "name": "우이신설선",
        "color": "#B7C450"
    },
    {
        "type": 114,
        "name": "서해선",
        "color": "#8fc31f"
    },
    {
        "type": 115,
        "name": "김포골드라인",
        "color": "#ad8605"
    },
    {
        "type": 116,
        "name": "수인분당선",
        "color": "#fabe00"
    },
    {
        "type": 117,
        "name": "신림선",
        "color": "#6789CA"
    },
    {
        "type": 21,
        "name": "인천 1호선",
        "color": "#759cce"
    },
    {
        "type": 22,
        "name": "인천 2호선",
        "color": "#f5a251"
    },
    {
        "type": 31,
        "name": "대전 1호선",
        "color": "#007448"
    },
    {
        "type": 41,
        "name": "대구 1호선",
        "color": "#d93f5c"
    },
    {
        "type": 42,
        "name": "대구 2호선",
        "color": "#00aa80"
    },
    {
        "type": 43,
        "name": "대구 3호선",
        "color": "#ffb100"
    },
    {
        "type": 51,
        "name": "광주 1호선",
        "color": "#009088"
    },
    {
        "type": 71,
        "name": "부산 1호선",
        "color": "#f06a00"
    },
    {
        "type": 72,
        "name": "부산 2호선",
        "color": "#81bf48"
    },
    {
        "type": 73,
        "name": "부산 3호선",
        "color": "#bb8c00"
    },
    {
        "type": 74,
        "name": "부산 4호선",
        "color": "#217dcb"
    },
    {
        "type": 78,
        "name": "동해선",
        "color": "#0054a6"
    },
    {
        "type": 79,
        "name": "부산-김해경전철",
        "color": "#875cac"
    }
]
export const initialPlaceLists: placeListInterface[] = [
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
        stay_amount: 0,
        vehicle_type: 0,
        vehicle_icon: <FaQuestion className="select_vehicle_icon"/>,
        vehicle_name: "default",
        move_time: new Date(new Date().setHours(0,0)),
        move_amount: 0,
        path_hide: true,
        start_time: new Date(new Date().setHours(0,0)),
        end_time: new Date(new Date().setHours(0,0)),
        path: [],
        public_path: [],
        path_color: "#3c3c3c",
    },
];
export const initialDateLists: dateListInterface[] = [
    {
        date: "",
        destination: "",
        people: 1,
        id: 1,
        place: "서울특별시",
        lat: "",
        lng: "",
        address: "",
        place_list: initialPlaceLists,
    },
    {
        date: "",
        destination: "",
        people: 1,
        id: 1,
        place: "서울특별시",
        lat: "",
        lng: "",
        address: "",
        place_list: initialPlaceLists,
    },
];
export const dummyPlaceData = {
    place_type: 0,
    place_name: "default",
    place_icon: <MdPlace className="select_place_icon"/>,
    stay_time: new Date(new Date().setHours(0, 0)),
    stay_amount: 0,
    vehicle_type: 0,
    vehicle_icon: <FaQuestion className="select_vehicle_icon"/>,
    vehicle_name: "default",
    move_time: new Date(new Date().setHours(0, 0)),
    move_amount: 0,
    path_hide: true,
    start_time: new Date(new Date().setHours(0, 0)),
    end_time: new Date(new Date().setHours(0, 0)),
    path: [],
    public_path: [],
    path_color: "#CBCBCB"
}
export const dummyRegionData = {
    y_coor: "",
    full_addr: "",
    x_coor: "",
    addr_name: "선택해주세요",
    region_name: "선택해주세요",
    cd: "0"
}
export const dummyRegionSeoulData = {
    addr_name: "서울특별시",
    region_name: "서울",
    cd: "11",
    full_addr: "서울특별시",
    x_coor: "953932",
    y_coor: "1952053"
}
export const dropdownIconVehicle: dropdownIconVehicleInterface[] = [
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
export const dropdownIconPlace: dropdownIconPlaceInterface[] = [
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