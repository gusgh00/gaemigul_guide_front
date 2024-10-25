"use client"
import React, {useEffect, useRef, useState} from "react";
import {FaBicycle, FaCar, FaQuestion, FaWalking} from "react-icons/fa";
import {FaBus} from "react-icons/fa6";

interface vehicleListInterface {
    id: number,
    vehicle_type: number,
    vehicle_icon: JSX.Element,
    vehicle_name: string,
    path_color: string
}

const VehiclePicker = (props: {
    vehicleItem: vehicleListInterface,
    onChange: (id: number, type: number, name: string, icon: JSX.Element, color: string) => void,
}) => {
    interface dropdownIconVehicleInterface {
        vehicle_type: number,
        vehicle_icon: JSX.Element,
        vehicle_name: string,
        path_color: string
    }

    const vehicleRef = useRef<HTMLDivElement | null>(null);

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