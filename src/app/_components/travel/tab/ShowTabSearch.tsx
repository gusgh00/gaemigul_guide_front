"use client"
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    DraggableStateSnapshot,
    Droppable,
    DroppableProvided,
    DroppableStateSnapshot, DropResult
} from "@hello-pangea/dnd";
import {RxDragHandleHorizontal} from "react-icons/rx";
import {MdClose} from "react-icons/md";
import {FaPlus} from "react-icons/fa";
import React from "react";
import {placeListInterface, searchListInterface} from "@interface/TravelInterface";

const TabSearch = (props: {
    map: kakao.maps.Map,
    placeList: placeListInterface[],
    setPlaceList: (list: placeListInterface[]) => void,
    setSearchList: (list: searchListInterface[]) => void,
    isAddList: boolean,
    setAddList: (type: boolean) => void,
    isAddPlaceId: number,
    setAddPlaceId: (id: number) => void,
}) => {
    const handleDragEnd = ({source, destination}: DropResult) => {
        if (!destination) return;

        const items = Array.from(props.placeList);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);

        props.setPlaceList(items);
    }

    const closePlaceList = (index: number) => {
        const items = Array.from(props.placeList);
        items.splice(index, 1);

        props.setPlaceList(items);
    }

    return (
        <>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="placeList">
                    {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                        <div
                            ref={provided.innerRef}
                            className={snapshot.isDraggingOver ? "all_place_section all_place_section_is_dragging" : "all_place_section"}
                            {...provided.droppableProps}>
                            {props.placeList.map((item: any, index: number) => {
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
                                                    <div className="place_list_div" onClick={() => props.map?.panTo(new kakao.maps.LatLng(Number(item.lat), Number(item.lng)))}>
                                                        <span className="scoredream-700 default_text place">{"[" + (index + 1) + "] "}{item.place}</span>
                                                        <span className="scoredream-500 grey_text address">{item.address}</span>
                                                    </div>
                                                    <div className={props.placeList.length > 1 ? "close_div" : "display_none"}>
                                                        <MdClose className="close_icon" onClick={() => {
                                                            closePlaceList(index)
                                                            if (item.id === props.isAddPlaceId) {
                                                                props.setAddList(false)
                                                            }
                                                        }}/>
                                                    </div>
                                                    {props.placeList.length >= 10 ? null :
                                                        <button className={props.isAddPlaceId === item.id && props.isAddList ? "add_button active" : "add_button"} onClick={() => {
                                                            props.setAddList(true)
                                                            props.setAddPlaceId(item.id)
                                                            props.setSearchList([])
                                                            props.map?.panTo(new kakao.maps.LatLng(Number(item.lat), Number(item.lng)))
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
        </>
    );
};

export default TabSearch;