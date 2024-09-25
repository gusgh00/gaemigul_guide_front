'use client'
import {Map} from "react-kakao-maps-sdk";
import {useEffect, useState} from "react";
import {
    DragDropContext,
    Draggable, DraggableProvided, DraggableStateSnapshot,
    Droppable,
    DroppableProvided,
    DroppableStateSnapshot,
    DropResult
} from "@hello-pangea/dnd";
import { RxDragHandleHorizontal } from "react-icons/rx";
import {FaBed, FaShoppingCart} from "react-icons/fa";
import {IoRestaurant} from "react-icons/io5";
import {MdClose, MdForest, MdMuseum, MdPlace} from "react-icons/md";
import {TbBeach} from "react-icons/tb";

const initialLists = [
    {
        id: 1,
        place: "서울역",
        lat: "37.5547125",
        lng: "126.9707878",
        address: "서울특별시 용산구 한강대로 405",
        place_type: 0,
    },
    {
        id: 2,
        place: "영등포역",
        lat: "37.5154133",
        lng: "126.9071288",
        address: "서울특별시 영등포구 영등포본동",
        place_type: 1,
    },
    {
        id: 3,
        place: "홍대입구역",
        lat: "37.557527",
        lng: "126.9244669",
        address: "서울특별시 마포구 양화로 지하 160",
        place_type: 2,
    },
    {
        id: 4,
        place: "홍익대학교 서울캠퍼스",
        lat: "37.5507563",
        lng: "126.9254901",
        address: "서울특별시 마포구 와우산로 94",
        place_type: 3,
    },
    {
        id: 5,
        place: "젠틀몬스터 홍대 플래그십스토어",
        lat: "37.5507563",
        lng: "126.9254901",
        address: "서울특별시 마포구 독막로7길 54",
        place_type: 4,
    },
    {
        id: 6,
        place: "63빌딩",
        lat: "37.5197159",
        lng: "126.9401255",
        address: "서울특별시 영등포구 63로 50",
        place_type: 5,
    },
    {
        id: 7,
        place: "탬버린즈 신사 플래그십스토어",
        lat: "37.5206264",
        lng: "127.0220599",
        address: "서울특별시 강남구 압구정로10길 44",
        place_type: 6,
    },
];

const Travel = () => {
    const [isHideList, setHideList] = useState(false)
    const [isListReady, setListReady] = useState(false)
    const [placeList, setPlaceList] = useState(initialLists);

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
                    <div className="travel_list_box">
                        <div className="travel_list_box_section">
                            {!isListReady ? null :
                            <DragDropContext onDragEnd={handleDragEnd}>
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
                                                                        {/*기본 (default), 숙박, 맛집, 관람, 레저, 쉼터, 쇼핑*/}
                                                                        {item.place_type === 0 && <div className="select_place_div default"><MdPlace className="select_place_icon"/></div>}
                                                                        {item.place_type === 1 && <div className="select_place_div hotel"><FaBed className="select_place_icon"/></div>}
                                                                        {item.place_type === 2 && <div className="select_place_div restaurant"><IoRestaurant className="select_place_icon"/></div>}
                                                                        {item.place_type === 3 && <div className="select_place_div museum"><MdMuseum className="select_place_icon"/></div>}
                                                                        {item.place_type === 4 && <div className="select_place_div leisure"><TbBeach className="select_place_icon"/></div>}
                                                                        {item.place_type === 5 && <div className="select_place_div rest"><MdForest className="select_place_icon"/></div>}
                                                                        {item.place_type === 6 && <div className="select_place_div shopping"><FaShoppingCart className="select_place_icon"/></div>}
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
                            </DragDropContext>}
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