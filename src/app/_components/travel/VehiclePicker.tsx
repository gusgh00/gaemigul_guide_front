"use client"
import type {JSX} from 'react'
import React, {useEffect, useRef, useState} from "react";
import {dropdownIconVehicleInterface, vehicleListInterface} from "@interface/TravelInterface";
import {dropdownIconVehicle} from "@module/DataArrayModule";

const VehiclePicker = (props: {
    vehicleItem: vehicleListInterface,
    onChange: (id: number, type: number, name: string, icon: JSX.Element, color: string) => void,
}) => {
    const vehicleRef = useRef<HTMLDivElement | null>(null);
    const [vehicleTab, setVehicleTab] = useState<dropdownIconVehicleInterface[]>(dropdownIconVehicle)
    const [isChangeVehicleTab, setChangeVehicleTab] = useState({vehicle_type: 0, item_id: 0, status: false})

    const changeVehicleTypeTab = (id: number, type: number) => {
        const tempVehicle = vehicleTab
        setVehicleTab([
            tempVehicle.filter(item => item.vehicle_type === type)[0],
            ...tempVehicle.filter(item => item.vehicle_type !== type)
        ])
        setChangeVehicleTab({vehicle_type: type, item_id: id, status: true})
    }

    const changeVehicleType = (id: number, type: number, name: string, icon: JSX.Element, color: string) => {
        props.onChange(id, type, name, icon, color)
        setChangeVehicleTab({vehicle_type: 0, item_id: 0, status: false})
    }

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const vehicleREF = vehicleRef.current;
            if (vehicleREF && !vehicleREF?.contains(e.target as Node)) {
                setChangeVehicleTab({vehicle_type: 0, item_id: 0, status: false})
            }
        };
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, [vehicleRef]);

    return (
        <>
            {/*기본 (default), 도보, 자가용, 대중교통, 자전거*/}
            <div className={"select_vehicle_div " + props.vehicleItem.vehicle_name} onClick={() => changeVehicleTypeTab(props.vehicleItem.id, props.vehicleItem.vehicle_type)}>
                {props.vehicleItem.vehicle_icon}
            </div>
            <div className={isChangeVehicleTab.status && props.vehicleItem.id === isChangeVehicleTab.item_id ? "select_vehicle_tab" : "display_none"} ref={vehicleRef} onClick={(e) => e.stopPropagation()}>
                {vehicleTab.map((value, index) => (
                    <div key={index} className={"select_vehicle_div " + value.vehicle_name + (value.vehicle_type === props.vehicleItem.vehicle_type ? " active" : "")}
                         onClick={() => {
                             changeVehicleType(props.vehicleItem.id, value.vehicle_type, value.vehicle_name, value.vehicle_icon, value.path_color)
                         }}
                    >
                        {value.vehicle_icon}
                    </div>
                ))}
            </div>
        </>
    );
};

export default VehiclePicker;