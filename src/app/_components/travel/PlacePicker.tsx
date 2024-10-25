"use client"
import React, {useEffect, useRef, useState} from "react";
import {MdForest, MdMuseum, MdPlace} from "react-icons/md";
import {FaBed, FaShoppingCart} from "react-icons/fa";
import {IoRestaurant} from "react-icons/io5";
import {TbBeach} from "react-icons/tb";

interface placeListInterface {
    id: number,
    place_type: number,
    place_name: string,
    place_icon: JSX.Element,
}

const PlacePicker = (props: {
    placeItem: placeListInterface,
    onChange: (id: number, type: number, name: string, icon: JSX.Element) => void,
}) => {
    interface dropdownIconPlaceInterface {
        place_type: number,
        place_icon: JSX.Element,
        place_name: string
    }

    const placeRef = useRef<HTMLDivElement | null>(null);

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

    const [placeTab, setPlaceTab] = useState<dropdownIconPlaceInterface[]>(dropdownIconPlace)

    const [isChangePlaceTab, setChangePlaceTab] = useState({place_type: 0, item_id: 0, status: false})

    const changePlaceTypeTab = (id: number, type: number) => {
        const tempPlace = placeTab
        setPlaceTab([
            tempPlace.filter(item => item.place_type === type)[0],
            ...tempPlace.filter(item => item.place_type !== type)
        ])
        setChangePlaceTab({place_type: type, item_id: id, status: true})
    }

    const changePlaceType = (id: number, type: number, name: string, icon: JSX.Element) => {
        props.onChange(id, type, name, icon)
        setChangePlaceTab({place_type: 0, item_id: 0, status: false})
    }

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const placeREF = placeRef.current;
            if (placeREF && !placeREF?.contains(e.target as Node)) {
                setChangePlaceTab({place_type: 0, item_id: 0, status: false})
            }
        };
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, [placeRef]);

    return (
        <>
            {/*기본 (default), 숙박, 맛집, 관람, 레저, 쉼터, 쇼핑*/}
            <div className={"select_place_div " + props.placeItem.place_name} onClick={() => changePlaceTypeTab(props.placeItem.id, props.placeItem.place_type)}>
                {props.placeItem.place_icon}
            </div>
            <div className={isChangePlaceTab.status && props.placeItem.id === isChangePlaceTab.item_id ? "select_place_tab" : "display_none"} ref={placeRef}>
                {placeTab.map((value, index) => (
                    <div key={index} className={"select_place_div " + value.place_name + (value.place_type === props.placeItem.place_type ? " active" : "")}
                         onClick={() => {
                             changePlaceType(props.placeItem.id, value.place_type, value.place_name, value.place_icon)
                         }}
                    >
                        {value.place_icon}
                    </div>
                ))}
            </div>
        </>
    );
};

export default PlacePicker;