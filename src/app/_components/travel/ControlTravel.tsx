import React, {useEffect, useState} from "react";
import axios from "axios";
import {FaMinusCircle, FaPlusCircle, FaQuestion} from "react-icons/fa";
import {MdPlace} from "react-icons/md";
import {addDays} from "date-fns";
import dayjs from "dayjs";
import proj4 from "proj4";
import DatePicker from "@/app/_components/travel/GMGDatePicker";

const ControlTravel = (props: any) => {
    interface placeListPath {
        lat: number,
        lng: number,
    }

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

    interface dateListInterface {
        date: string,
        destination: string,
        people: number,
        place_list: placeListInterface[],
    }

    interface regionListInterface {
        y_coor: string,
        full_addr: string,
        x_coor: string,
        addr_name: string,
        cd: string
    }
    // const [dateList, setDateList] = useState<dateListInterface[]>([]);
    // const [placeList, setPlaceList] = useState<placeListInterface[]>([]);

    const [regionTopList, setRegionTopList] = useState<regionListInterface[]>([{
        y_coor: "",
        full_addr: "",
        x_coor: "",
        addr_name: "선택해주세요",
        cd: "0"
    }])
    const [regionMiddleList, setRegionMiddleList] = useState<regionListInterface[]>([{
        y_coor: "",
        full_addr: "",
        x_coor: "",
        addr_name: "선택해주세요",
        cd: "0"
    }])
    const [regionBottomList, setRegionBottomList] = useState<regionListInterface[]>([{
        y_coor: "",
        full_addr: "",
        x_coor: "",
        addr_name: "선택해주세요",
        cd: "0"
    }])

    const [regionTop, setRegionTop] = useState<string>("선택해주세요")
    const [regionMiddle, setRegionMiddle] = useState<string>("선택해주세요")
    const [regionBottom, setRegionBottom] = useState<string>("선택해주세요")

    const [peopleNum, setPeopleNum] = useState<number>(1)

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())

    const getAccessKey = async () => {
        const url = process.env.NEXT_PUBLIC_SGIS_ACCESS_URL as string
        const serviceId = process.env.NEXT_PUBLIC_SGIS_SERVICE_ID as string
        const securityKey = process.env.NEXT_PUBLIC_SGIS_SECURITY_KEY as string
        let accessToken: string = ""
        await axios.get(url, {
            params: {
                consumer_key: serviceId,
                consumer_secret: securityKey
            }
        })
            .then(response => {
                if (response.data.errCd === 0) {
                    accessToken = response.data.result.accessToken
                }
            })
        return accessToken
    }

    const getRegionTop = async () => {
        const url = process.env.NEXT_PUBLIC_SGIS_URL as string
        const accessToken = await getAccessKey()
        await axios.get(url, {
            params: {
                accessToken: accessToken
            }
        })
            .then(response => {
                if (response.data.errCd === 0) {
                    setRegionTopList([{
                        y_coor: "",
                        full_addr: "",
                        x_coor: "",
                        addr_name: "선택해주세요",
                        cd: "0"
                    }, ...response.data.result])
                }
            })
    }

    const getRegionMiddle = async (currentRegionTop: regionListInterface) => {
        const url = process.env.NEXT_PUBLIC_SGIS_URL as string
        const accessToken = await getAccessKey()
        await axios.get(url, {
            params: {
                cd: currentRegionTop.cd,
                accessToken: accessToken
            }
        })
            .then(response => {
                if (response.data.errCd === 0) {
                    setRegionMiddleList([{
                        y_coor: "",
                        full_addr: "",
                        x_coor: "",
                        addr_name: "선택해주세요",
                        cd: "0"
                    }, ...response.data.result])
                }
            })
    }

    const getRegionBottom = async (currentRegionMiddle: regionListInterface) => {
        const url = process.env.NEXT_PUBLIC_SGIS_URL as string
        const accessToken = await getAccessKey()
        await axios.get(url, {
            params: {
                cd: currentRegionMiddle.cd,
                accessToken: accessToken
            }
        })
            .then(response => {
                if (response.data.errCd === 0) {
                    setRegionBottomList([{
                        y_coor: "",
                        full_addr: "",
                        x_coor: "",
                        addr_name: "선택해주세요",
                        cd: "0"
                    }, ...response.data.result])
                }
            })
    }

    useEffect(() => {
        getRegionTop().then()
    }, [])

    const handleChangeRegionTop = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        let currentRegionTop: regionListInterface = regionTopList.filter(item => item.addr_name === event.target.value)[0]
        setRegionTop(currentRegionTop.addr_name)
        setRegionMiddle("선택해주세요")
        setRegionBottom("선택해주세요")
        setRegionBottomList([{
            y_coor: "",
            full_addr: "",
            x_coor: "",
            addr_name: "선택해주세요",
            cd: "0"
        }])

        await getRegionMiddle(currentRegionTop)
    }

    const handleChangeRegionMiddle = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        let currentRegionMiddle: regionListInterface = regionMiddleList.filter(item => item.addr_name === event.target.value)[0]
        setRegionMiddle(currentRegionMiddle.addr_name)
        setRegionBottom("선택해주세요")

        await getRegionBottom(currentRegionMiddle)
    }

    const handleChangeRegionBottom = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let currentRegionBottom: regionListInterface = regionBottomList.filter(item => item.addr_name === event.target.value)[0]
        setRegionBottom(currentRegionBottom.addr_name)
    }

    const handleChangePeopleNum = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPeopleNum(Number(event.target.value))
    }

    const handleChangeDate = (date: Date) => {
        setStartDate(date)
        setEndDate(date)
    }

    const setControlTravel = () => {
        let currentRegion: regionListInterface = {} as regionListInterface
        if (regionTop === "선택해주세요" && regionMiddle === "선택해주세요" && regionBottom === "선택해주세요") {
            alert("지역을 선택해 주세요.")
            return false
        }
        else if (regionTop !== "선택해주세요" && regionMiddle === "선택해주세요" && regionBottom === "선택해주세요") {
            currentRegion = regionTopList.filter(item => item.addr_name === regionTop)[0]
        }
        else if (regionTop !== "선택해주세요" && regionMiddle !== "선택해주세요" && regionBottom === "선택해주세요") {
            currentRegion = regionMiddleList.filter(item => item.addr_name === regionMiddle)[0]
        }
        else if (regionTop !== "선택해주세요" && regionMiddle !== "선택해주세요" && regionBottom !== "선택해주세요") {
            currentRegion = regionBottomList.filter(item => item.addr_name === regionBottom)[0]
        }

        let dateList: dateListInterface[] = []
        let currentDate = dayjs(startDate)
        const utmKProjection = '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs';
        const wgs84Projection = 'EPSG:4326';
        const [lng, lat] = proj4(utmKProjection, wgs84Projection, [Number(currentRegion.x_coor), Number(currentRegion.y_coor)])

        while (currentDate.isBefore(dayjs(endDate).add(1, "day"))) {
            dateList.push({
                date: dayjs(currentDate).format("YYYY년 MM월 DD일"),
                destination: currentRegion.addr_name,
                people: Number(peopleNum),
                place_list: [{
                    id: 1,
                    place: currentRegion.addr_name,
                    lat: lat.toString(),
                    lng: lng.toString(),
                    address: currentRegion.full_addr,
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
                }]
            })
            currentDate = currentDate.add(1, "day")
        }

        props.setControlTravel(dateList)
    }

    useEffect(() => {
        let travelParams = JSON.parse(localStorage.getItem("travel") as string)
        let tempRegion = travelParams.region
        let tempStart = new Date(travelParams.start as string)
        let tempEnd = new Date(travelParams.end as string)

        setRegionTop(tempRegion.addr_name)
        setStartDate(tempStart)
        setEndDate(tempEnd)

        getRegionMiddle(tempRegion).then()
    }, []);

    return (
        <>
            <div className="control_background">
                <div className="control_section">
                    <div className="control_title">
                        <span className="scoredream-700 default_text">여행 계획하기</span>
                    </div>
                    <div className="control_region">
                        <div className="region_title">
                            <span className="scoredream-500 grey_text title_span">지역</span>
                        </div>
                        <div className="region_content">
                            <select className="scoredream-700 default_text region" onChange={(event) => handleChangeRegionTop(event)} value={regionTop}>
                                {regionTopList.map((item, index) => (
                                    <option value={item.addr_name} key={index} disabled={item.cd === "0"} hidden={item.cd === "0"}>
                                        {item.addr_name}
                                    </option>
                                ))}
                            </select>
                            <select className="scoredream-700 default_text region" onChange={(event) => handleChangeRegionMiddle(event)} value={regionMiddle}>
                                {regionMiddleList.map((item, index) => (
                                    <option value={item.addr_name} key={index} disabled={item.cd === "0"} hidden={item.cd === "0"}>
                                        {item.addr_name}
                                    </option>
                                ))}
                            </select>
                            <select className="scoredream-700 default_text region" onChange={(event) => handleChangeRegionBottom(event)} value={regionBottom}>
                                {regionBottomList.map((item, index) => (
                                    <option value={item.addr_name} key={index} disabled={item.cd === "0"} hidden={item.cd === "0"}>
                                        {item.addr_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="control_people">
                        <div className="people_title">
                            <span className="scoredream-500 grey_text title_span">인원</span>
                        </div>
                        <div className="people_content">
                            <button className="people_minus_btn" onClick={() => setPeopleNum(peopleNum - 1)} disabled={peopleNum <= 1}>
                                <FaMinusCircle className={peopleNum <= 1 ? "people_minus_icon disabled" : "people_minus_icon"}/>
                            </button>
                            <input type="text" maxLength={3} className="scoredream-700 default_text people" value={peopleNum} onChange={(e) => handleChangePeopleNum(e)}/>
                            <span className="scoredream-700 grey_text people">명</span>
                            <button className="people_plus_btn" onClick={() => setPeopleNum(peopleNum + 1)} disabled={peopleNum >= 999}>
                                <FaPlusCircle className={peopleNum >= 999 ? "people_plus_icon disabled" : "people_plus_icon"}/>
                            </button>
                        </div>
                    </div>
                    <div className="control_date">
                        <div className="date_title">
                            <span className="scoredream-500 grey_text title_span">날짜</span>
                        </div>
                        <div className="date_content">
                            <div className="date_start">
                                <span className="scoredream-700 grey_text date_sub_title">
                                    시작일{" "}
                                    <span className="scoredream-700 default_text date">{dayjs(startDate).format("YYYY년 MM월 DD일")}</span>
                                </span>
                                <DatePicker
                                    inline={true}
                                    onChange={(date: Date) => date && handleChangeDate(date)}
                                    minDate={new Date()}
                                    selectDate={startDate ? startDate : new Date()}
                                />
                            </div>
                            <div className="date_end">
                                <span className="scoredream-700 grey_text date_sub_title">
                                    종료일{" "}
                                    <span className="scoredream-700 default_text date">{dayjs(endDate).format("YYYY년 MM월 DD일")}</span>
                                </span>
                                <DatePicker
                                    inline={true}
                                    onChange={(date: Date) => date && setEndDate(date)}
                                    minDate={startDate ? startDate : new Date(new Date().setDate(new Date().getDate() + 4))}
                                    maxDate={addDays(startDate ? startDate : new Date(), 4)}
                                    selectDate={endDate ? endDate : new Date()}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="control_button">
                        <button className="button_submit scoredream-500 grey_text" onClick={setControlTravel}>적용</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ControlTravel;