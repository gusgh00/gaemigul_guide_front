'use client'
import {Map, MapMarker, Polyline} from "react-kakao-maps-sdk";
import React, {Suspense, useEffect, useState} from "react";
import {GrPowerReset} from "react-icons/gr";
import ControlTravel from "@/app/_components/travel/ControlTravel";
import TravelSearch from "@/app/_components/travel/TravelSearch";
import {
    findMaxIdLocation,
} from "@module/TravelModule";
import {
    dummyPlaceData,
    initialDateLists,
    initialPlaceLists
} from '@module/DataArrayModule'
import {
    dateListInterface, dropdownIconPlaceInterface,
    placeListInterface,
    searchListInterface
} from "@interface/TravelInterface";
import FooterBox from "@/app/_components/footer_box";
import ShowTabSearch from "@/app/_components/travel/tab/ShowTabSearch";
import ShowTabDetail from "@/app/_components/travel/tab/ShowTabDetail";
import ShowTabResult from "@/app/_components/travel/tab/ShowTabResult";
import RouteDetail from "@/app/_components/travel/RouteDetail";
import {convertDateList} from "@module/convertXlsx";

const Travel = () => {
    const [isAddList, setAddList] = useState(false)
    const [isAddPlaceId, setAddPlaceId] = useState(0)
    const [isRouteDetail, setRouteDetail] = useState(false)
    const [isRouteDetailId, setRouteDetailId] = useState(0)
    const [isHideControl, setHideControl] = useState(false)
    const [isHideList, setHideList] = useState(false)
    const [isListReady, setListReady] = useState(false)
    const [dateList, setDateList] = useState<dateListInterface[]>(initialDateLists);
    const [placeList, setPlaceList] = useState<placeListInterface[]>(initialPlaceLists);
    const [isTab, setTab] = useState(0)
    const [dateSelected, setDateSelected] = useState<string>("")
    const [searchList, setSearchList] = useState<searchListInterface[]>([]);
    const [isPlaceMarkerInfo, setPlaceMarkerInfo] = useState(false)
    const [isPlaceMarkerInfoId, setPlaceMarkerInfoId] = useState(0)
    const [isSearchMarkerInfo, setSearchMarkerInfo] = useState(false)
    const [isSearchMarkerInfoId, setSearchMarkerInfoId] = useState(0)
    const [isMapDraggable, setMapDraggable] = useState(true)
    const [isMapZoomable, setMapZoomable] = useState(true)
    const [map, setMap] = useState<kakao.maps.Map>()
    const [totalAmount, setTotalAmount] = useState<string>("")

    const tabList = ['경유지 탐색', '경유지 상세', '최종 계획']

    useEffect(() => {
        setListReady(true)
    }, [])

    const addSearchList = (place: string, lat: string, lng: string, address: string, place_icon: dropdownIconPlaceInterface, index: number) => {
        const tempPlaceList: placeListInterface[] = [...placeList]
        const frontPlaceIndex = placeList.findIndex(item => item.id === isAddPlaceId)
        const maxPlaceId = findMaxIdLocation(tempPlaceList).id
        const newPlaceItem: placeListInterface = {
            ...dummyPlaceData,
            id: maxPlaceId + 1,
            place: place,
            lat: lat,
            lng: lng,
            address: address,
            place_icon: place_icon.place_icon,
            place_type: place_icon.place_type,
            place_name: place_icon.place_name,
        }
        tempPlaceList.splice(frontPlaceIndex + 1, 0, newPlaceItem)
        setPlaceList(tempPlaceList)

        if (searchList) {
            const tempSearchList: searchListInterface[] = [...searchList]
            tempSearchList.splice(index, 1)
            setSearchList(tempSearchList)
        }
    }

    const showTab = () => {
        switch (isTab) {
            case 0:
                return <ShowTabSearch
                    map={map as kakao.maps.Map}
                    placeList={placeList}
                    setPlaceList={(list: placeListInterface[]) => setPlaceList(list)}
                    setSearchList={(list: searchListInterface[]) => setSearchList(list)}
                    isAddList={isAddList}
                    setAddList={(type: boolean) => setAddList(type)}
                    isAddPlaceId={isAddPlaceId}
                    setAddPlaceId={(id: number) => setAddPlaceId(id)}
                />
            case 1:
                return <ShowTabDetail
                    map={map as kakao.maps.Map}
                    placeList={placeList}
                    dateList={dateList}
                    closeRouteDetail={isRouteDetail}
                    setPlaceList={(list: placeListInterface[]) => setPlaceList(list)}
                    setDateList={(list: dateListInterface[]) => setDateList(list)}
                    setRouteDetail={(type: boolean) => setRouteDetail(type)}
                    setPlaceId={(id: number) =>setRouteDetailId(id)}
                    dateSelected={dateSelected}
                />
            case 2:
                return <ShowTabResult
                    map={map as kakao.maps.Map}
                    placeList={placeList}
                    dateList={dateList}
                    dateSelected={dateSelected}
                />
        }
    }

    const handleChangeDateSelect= (e: React.ChangeEvent<any>) => {
        setDateList(dateList.map(item => {
            if (item.date === dateSelected) {
                return { ...item, place_list: placeList }
            } else {
                return item
            }
        }))
        setDateSelected(e.target.value);
        let tempDateList = dateList.filter(item => item.date === e.target.value)[0]
        setPlaceList(tempDateList.place_list)
        map?.panTo(new kakao.maps.LatLng(Number(tempDateList.place_list[0].lat), Number(tempDateList.place_list[0].lng)))
    }

    const handleResetDateSelected = () => {
        let tempDateList = dateList.filter(item => item.date === dateSelected)[0]
        const newPlaceItem: placeListInterface = {
            id: tempDateList.id,
            place: tempDateList.place,
            lat: tempDateList.lat,
            lng: tempDateList.lng,
            address: tempDateList.address,
            ...dummyPlaceData
        }
        setPlaceList([newPlaceItem])
        map?.panTo(new kakao.maps.LatLng(Number(tempDateList.lat), Number(tempDateList.lng)))
    }

    const updateControlTravel = (dateList: dateListInterface[]) => {
        setHideControl(true)
        setDateList(dateList)
        setDateSelected(dateList[0].date)
        setPlaceList(dateList[0].place_list)
        map?.panTo(new kakao.maps.LatLng(Number(dateList[0].place_list[0].lat), Number(dateList[0].place_list[0].lng)))
    }

    useEffect(() => {
        if (!map) return
        else {
            map.setCopyrightPosition(kakao.maps.CopyrightPosition.BOTTOMRIGHT, true)
            if (isTab === 2) {
                let bounds = new kakao.maps.LatLngBounds()

                placeList.forEach((item) => {
                    bounds.extend(new kakao.maps.LatLng(Number(item.lat), Number(item.lng)))
                })

                map.setBounds(bounds)
                setMapDraggable(false)
                setMapZoomable(false)
            } else {
                setMapDraggable(true)
                setMapZoomable(true)
            }
        }
    }, [isTab, placeList, map]);

    useEffect(() => {
        let infoTitle = document.querySelectorAll('.marker_info');
        infoTitle.forEach(function(value: Element) {
            if (value.parentElement && value.parentElement.parentElement) {
                value.parentElement.parentElement.style.border = "0px";
                value.parentElement.parentElement.style.background = "unset";
                value.parentElement.parentElement.style.width = "100%";
                let bubbleBottom: HTMLElement = value.parentElement.previousElementSibling as HTMLElement
                bubbleBottom.style.display = "none";
            }
        });
    }, [isSearchMarkerInfo, isSearchMarkerInfoId, isPlaceMarkerInfo, isPlaceMarkerInfoId]);

    useEffect(() => {
        let totalAmount = 0
        let people = dateList[0].people
        for (let k = 0; k < placeList.length; k++) {
            let move_amount = placeList[k].move_amount * 10000
            let stay_amount = placeList[k].stay_amount * 10000
            totalAmount += (move_amount + stay_amount)
        }
        for (let i = 0; i < dateList.length; i++) {
            if (dateList[i].date !== dateSelected) {
                for (let j = 0; j < dateList[i].place_list.length; j++) {
                    let move_amount = dateList[i].place_list[j].move_amount * 10000
                    let stay_amount = dateList[i].place_list[j].stay_amount * 10000
                    totalAmount += (move_amount + stay_amount)
                }
            }
        }
        setTotalAmount(Math.floor(totalAmount / people) + "원 / " + totalAmount + '원')
    }, [dateList, placeList, dateSelected]);

    useEffect(() => {
        setDateList(dateList.map(item => {
            if (item.date === dateSelected) {
                return { ...item, place_list: placeList }
            } else {
                return item
            }
        }))
    }, [placeList]);

    return (
        <>
            <div>
                {!isHideControl ?
                    <Suspense>
                        <ControlTravel setControlTravel={updateControlTravel}/>
                    </Suspense>
                    : null}
                <div className="travel_top_banner">
                    <div className="banner_inner main_inner">
                        <div className="banner_inner_info">
                            <span className="scoredream-500 default_text">날짜 : <span className="scoredream-500 grey_text">{dateList && dateList[0].date + " ~ " + dateList[dateList.length - 1].date}</span></span>
                            <span className="scoredream-500 default_text">대표지역 : <span className="scoredream-500 grey_text">{dateList && dateList[0].destination}</span></span>
                            <span className="scoredream-500 default_text">인원 : <span className="scoredream-500 grey_text">{dateList && dateList[0].people}명</span></span>
                            <span className="scoredream-500 default_text">총 금액 : <span className="scoredream-500 grey_text">{totalAmount}</span></span>
                        </div>
                        <div className="banner_inner_button">
                            <button className="banner_button_save" onClick={() => convertDateList(dateList, totalAmount)}>
                                <span className="scoredream-700 white_text">엑셀로 저장하기</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className={!isHideList ? "travel_list_section travel_list_section_no_hide" : "travel_list_section travel_list_section_hide"}>
                    <div className="travel_list_box">
                        <div className="travel_list_box_section">
                            <div className="travel_list_box_menu">
                                <div className="travel_list_box_menu_top">
                                    <select className="scoredream-500 grey_text select_date" onChange={(event) => handleChangeDateSelect(event)} value={dateSelected}>
                                        {dateList.map((item, index) => (
                                            <option value={item.date} key={index}>
                                                {item.date}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="scoredream-500 grey_text current_clear_button" onClick={() => handleResetDateSelected()}>
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
                                                    setRouteDetail(false)
                                                }}>
                                                {tab}
                                            </button>
                                            {/*{index === tabList.length - 1 ? null : <span className="scoredream-500 grey_text tab_button">{">"}</span>}*/}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {!isListReady ? null : showTab()}
                            <FooterBox/>
                        </div>
                    </div>
                    <div className="travel_list_button" onClick={() => {
                        setHideList(!isHideList)
                        setAddList(false)
                        setRouteDetail(false)
                    }}>
                    </div>
                </div>
                {isAddList &&
                <TravelSearch
                    placeList={placeList}
                    searchList={searchList}
                    placeId={isAddPlaceId}
                    setCenter={(lat: number, lng: number) => map?.panTo(new kakao.maps.LatLng(lat, lng))}
                    setPlaceList={(place: string, lat: string, lng: string, address: string, place_icon: dropdownIconPlaceInterface, index: number) => addSearchList(place, lat, lng, address, place_icon, index)}
                    setSearchList={(data: searchListInterface[]) => setSearchList(data)}
                    setAddList={(status: boolean) => setAddList(status)}
                />}
                {isRouteDetail &&
                <RouteDetail
                    placeList={placeList}
                    placeId={isRouteDetailId}
                    setRouteDetail={(status: boolean) => setRouteDetail(status)}
                />}
                <span className="scoredream-700 dark_text powered_odsay">powered by www.ODsay.com</span>
                <Map
                    id="map"
                    center={{lat: 37.5547125, lng: 126.9707878}}
                    isPanto={true}
                    style={{
                        width: "1920px",
                        height: "866px",
                    }}
                    className={!isHideList ? "travel_map active" : "travel_map"}
                    draggable={isMapDraggable}
                    zoomable={isMapZoomable}
                    level={3}
                    onCreate={(map: kakao.maps.Map) => setMap(map)}
                >
                    {isTab === 0 && placeList && placeList.map((item, index) => (
                        <MapMarker
                            key={index}
                            position={{
                                lat: Number(item.lat),
                                lng: Number(item.lng)
                            }}
                            zIndex={0}
                            image={{
                                src: "https://raw.githubusercontent.com/gusgh00/gaemigul_guide_img/refs/heads/main/list_marker_" + index + ".png",
                                size: {
                                    width: 43,
                                    height: 64
                                }
                            }}
                            clickable={true}
                            onClick={() => {
                                map?.panTo(new kakao.maps.LatLng(Number(item.lat), Number(item.lng)))
                            }}
                            onMouseOver={() => {
                                setPlaceMarkerInfo(true)
                                setPlaceMarkerInfoId(item.id)
                            }}
                            onMouseOut={() => {
                                setPlaceMarkerInfo(false)
                                setPlaceMarkerInfoId(0)
                            }}
                        >
                            {isPlaceMarkerInfoId === item.id && isPlaceMarkerInfo &&
                                <div className="marker_info">
                                    <span className="scoredream-700 default_text place">{item.place}</span>
                                    <span className="scoredream-500 grey_text address">{item.address}</span>
                                </div>
                            }
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
                                src: "https://raw.githubusercontent.com/gusgh00/gaemigul_guide_img/refs/heads/main/place_marker_" + item.place_type + ".png",
                                size: {
                                    width: 43,
                                    height: 64
                                }
                            }}
                            clickable={isTab === 1}
                            onClick={() => {
                                map?.panTo(new kakao.maps.LatLng(Number(item.lat), Number(item.lng)))
                            }}
                            onMouseOver={() => {
                                setPlaceMarkerInfo(true)
                                setPlaceMarkerInfoId(item.id)
                            }}
                            onMouseOut={() => {
                                setPlaceMarkerInfo(false)
                                setPlaceMarkerInfoId(0)
                            }}
                        >
                            {isPlaceMarkerInfoId === item.id && isPlaceMarkerInfo && isTab === 1 &&
                                <div className="marker_info">
                                    <span className="scoredream-700 default_text place">{item.place}</span>
                                    <span className="scoredream-500 grey_text address">{item.address}</span>
                                </div>
                            }
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
                                src: "https://raw.githubusercontent.com/gusgh00/gaemigul_guide_img/refs/heads/main/search_list_marker.png",
                                size: {
                                    width: 43,
                                    height: 64
                                }
                            }}
                            clickable={true}
                            onClick={() => {
                                if (!!placeList && placeList?.length < 10) {
                                    map?.panTo(new kakao.maps.LatLng(Number(item.lat), Number(item.lng)))
                                    addSearchList(item.place, item.lat, item.lng, item.address, item.place_icon, index)
                                }
                            }}
                            onMouseOver={() => {
                                setSearchMarkerInfo(true)
                                setSearchMarkerInfoId(item.id)
                            }}
                            onMouseOut={() => {
                                setSearchMarkerInfo(false)
                                setSearchMarkerInfoId(0)
                            }}
                        >
                            {isSearchMarkerInfoId === item.id && isSearchMarkerInfo &&
                                <div className="marker_info">
                                    <span className="scoredream-700 default_text place">{item.place}</span>
                                    <span className="scoredream-500 grey_text address">{item.address}</span>
                                </div>
                            }
                        </MapMarker>
                    ))}
                    {(isTab === 1 || isTab === 2) && placeList && placeList.map((item, index) => (
                        item.vehicle_type === 3 ?
                            item.public_path.map((value, idx) => (
                                <Polyline
                                    key={idx}
                                    path={[value.path]}
                                    strokeWeight={value.type === 0 ? 7 : 5} // 선의 두께 입니다
                                    strokeColor={value.path_color} // 선의 색깔입니다
                                    strokeOpacity={1} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                                    strokeStyle={value.type === 0 ? "shortdashdot" : "solid"} // 선의 스타일입니다
                                >
                                </Polyline>
                            )) :
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