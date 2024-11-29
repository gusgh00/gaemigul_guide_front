"use client"
import type {JSX} from 'react'
import React, {useEffect, useRef, useState} from "react";
import {dropdownIconPlaceInterface, placePickListInterface} from "@interface/TravelInterface";
import {dropdownIconPlace} from "@module/DataArrayModule";

const PlacePicker = (props: {
    placeItem: placePickListInterface,
    onChange: (id: number, type: number, name: string, icon: JSX.Element) => void,
}) => {
    const placeRef = useRef<HTMLDivElement | null>(null);
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