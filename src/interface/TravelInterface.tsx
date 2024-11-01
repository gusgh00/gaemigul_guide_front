export interface regionListInterface {
    y_coor: string,
    full_addr: string,
    x_coor: string,
    addr_name: string,
    region_name: string,
    cd: string
}
export interface placeListPublicPath {
    path_color: string,
    type: number,
    path: placeListPath[]
}
export interface placeListPath {
    lat: number,
    lng: number,
}
export interface placeListInterface {
    id: number,
    place: string,
    lat: string,
    lng: string,
    address: string,
    place_type: number,
    place_name: string,
    place_icon: JSX.Element,
    stay_time: Date,
    stay_amount: number,
    vehicle_type: number,
    vehicle_icon: JSX.Element,
    vehicle_name: string,
    move_time: Date,
    move_amount: number,
    path_hide: boolean,
    start_time: Date,
    end_time: Date,
    path: placeListPath[],
    public_path: placeListPublicPath[],
    path_color: string
}
export interface dateListInterface {
    date: string,
    destination: string,
    people: number,
    id: number,
    place: string,
    lat: string,
    lng: string,
    address: string,
    place_list: placeListInterface[],
}
export interface searchListInterface {
    id: number,
    place: string,
    lat: string,
    lng: string,
    address: string,
    url: string,
    img: string,
    social: string,
    place_icon: dropdownIconPlaceInterface
}

export interface vehicleListInterface {
    id: number,
    vehicle_type: number,
    vehicle_icon: JSX.Element,
    vehicle_name: string,
    path_color: string
}
export interface dropdownIconVehicleInterface {
    vehicle_type: number,
    vehicle_icon: JSX.Element,
    vehicle_name: string,
    path_color: string
}

export interface placePickListInterface {
    id: number,
    place_type: number,
    place_name: string,
    place_icon: JSX.Element,
}
export interface dropdownIconPlaceInterface {
    place_type: number,
    place_icon: JSX.Element,
    place_name: string
}