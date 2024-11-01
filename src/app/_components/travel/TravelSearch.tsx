"use client"
import React, {useEffect, useState} from "react";
import {MdAutoAwesome, MdClose} from "react-icons/md";
import {FaPlus, FaSearch} from "react-icons/fa";
import Link from "next/link";
import {dropdownIconPlaceInterface, placeListInterface, searchListInterface} from "@interface/TravelInterface";
import CategoryCode = kakao.maps.CategoryCode;
import {dropdownIconPlace} from "@module/DataArrayModule";

const TravelSearch = (props: {
    placeList: placeListInterface[],
    placeId: number,
    setCenter: (lat: number, lng: number) => void,
    setPlaceList: (place: string, lat: string, lng: string, address: string, place_icon: dropdownIconPlaceInterface) => void
    setSearchList: (data: searchListInterface[]) => void
    setAddList: (status: boolean) => void
}) => {
    const [searchValue, setSearchValue] = useState("")
    const [searchList, setSearchList] = useState<searchListInterface[]>([]);
    const [dummyPlaceIdArr, setDummyPlaceIdArr] = useState<number[]>([])

    const getConvertCodeToType = (code: CategoryCode) => {
        const categoryCodeArr = [
            {
                code: "AD5" as kakao.maps.CategoryCode, //숙박
                type: 1
            },
            {
                code: "CS2" as kakao.maps.CategoryCode, //편의점
                type: 6
            },
            {
                code: "MT1" as kakao.maps.CategoryCode, //대형마트
                type: 6
            },
            {
                code: "PK6" as kakao.maps.CategoryCode, //주차장
                type: 0
            },
            {
                code: "OL7" as kakao.maps.CategoryCode, //주유소
                type: 0
            },
            {
                code: "CT1" as kakao.maps.CategoryCode, //문화시설
                type: 3
            },
            {
                code: "AT4" as kakao.maps.CategoryCode, //관광명소
                type: 4
            },
            {
                code: "FD6" as kakao.maps.CategoryCode, //음식점
                type: 2
            },
            {
                code: "CE7" as kakao.maps.CategoryCode, //카페
                type: 2
            },
            {
                code: "SW8" as kakao.maps.CategoryCode, //지하철역
                type: 0
            },
            {
                code: "" as kakao.maps.CategoryCode, //기타
                type: 0
            },
        ]

        let type = categoryCodeArr.filter(item => item.code === code)[0].type

        return dropdownIconPlace.filter(item => item.place_type === type)[0]
    }

    const getRandomCode = () => {
        const categoryCodeArr = [
            // "" as kakao.maps.CategoryCode, //코드 미부여
            "AD5" as kakao.maps.CategoryCode, //숙박
            "CS2" as kakao.maps.CategoryCode, //편의점
            "MT1" as kakao.maps.CategoryCode, //대형마트
            "PK6" as kakao.maps.CategoryCode, //주차장
            "OL7" as kakao.maps.CategoryCode, //주유소
            "CT1" as kakao.maps.CategoryCode, //문화시설
            "AT4" as kakao.maps.CategoryCode, //관광명소
            "FD6" as kakao.maps.CategoryCode, //음식점
            "CE7" as kakao.maps.CategoryCode, //카페
            "SW8" as kakao.maps.CategoryCode, //지하철역
        ]
        const defaultPbtArr = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
        const carPbtArr = [10, 0, 10, 20, 20, 10, 10, 10, 10, 0]
        const cyclePbtArr = [10, 30, 0, 10, 0, 10, 10, 10, 10, 10]
        const BusPbtArr = [0, 10, 0, 0, 0, 20, 20, 20, 20, 10]
        const WalkingPbtArr = [0, 10, 0, 0, 0, 20, 20, 20, 20, 10]
        const lastPbtArr = [40, 20, 20, 10, 0, 0, 0, 10, 0, 0]

        const currentPlace = props.placeList.find(item => item.id === props.placeId)

        const weights: { [key: string]: number } = {};
        categoryCodeArr.forEach((category, index) => {
            if (props.placeList.length > 3 && props.placeList.findIndex(item => item.id === props.placeId) + 1 === props.placeList.length) {
                weights[category] = lastPbtArr[index]
            } else {
                if (currentPlace?.vehicle_type === 1) {
                    weights[category] = WalkingPbtArr[index];
                }
                else if (currentPlace?.vehicle_type === 2) {
                    weights[category] = carPbtArr[index];
                }
                else if (currentPlace?.vehicle_type === 3) {
                    weights[category] = BusPbtArr[index];
                }
                else if (currentPlace?.vehicle_type === 4) {
                    weights[category] = cyclePbtArr[index];
                }
                else {
                    weights[category] = defaultPbtArr[index];
                }
            }
        });

        let res: kakao.maps.CategoryCode[] = []
        for (let j = 0; j < 10; j++) {
            let randNum = Math.random() * 100
            let cumulativeWeight = 0

            for (const category of categoryCodeArr) {
                if (res.length == 10) {
                    break
                }
                cumulativeWeight += weights[category];
                if (randNum < cumulativeWeight) {
                    res.push(category)
                }
            }
        }
        return res
    }

    const getCategoryRoute = (code: kakao.maps.CategoryCode): Promise<searchListInterface> => {
        return new Promise((resolve) => {
            const place = new kakao.maps.services.Places()
            const options = {
                size: 10,
                page: 1,
                location: new kakao.maps.LatLng(Number(props.placeList.find(item => item.id === props.placeId)?.lat), Number(props.placeList.find(item => item.id === props.placeId)?.lng)),
                sort: kakao.maps.services.SortBy.DISTANCE,
                radius: 10000,
            }

            place.categorySearch(code as kakao.maps.CategoryCode, (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    for (let i = 0; i < data.slice(0, 10).length; i++) {
                        if (!dummyPlaceIdArr.includes(Number(data[i].id))) {
                            const keywordSearchList: searchListInterface = {
                                id: Number(data[i].id),
                                place: data[i].place_name,
                                lat: data[i].y,
                                lng: data[i].x,
                                address: data[i].address_name,
                                url: data[i].place_url,
                                img: "",
                                social: "카카오맵",
                                place_icon: getConvertCodeToType(data[i].category_group_code as CategoryCode)
                            }
                            setDummyPlaceIdArr([...dummyPlaceIdArr, Number(data[i].id)])
                            resolve(keywordSearchList)
                        }
                    }
                }
            }, options)
        })
    }

    const changeSearchValue = (value: string) => {
        setSearchValue(value)
    }

    const setKeywordList = () => {
        setDummyPlaceIdArr([])
        const place = new kakao.maps.services.Places()
        const options = {
            size: 10,
            page: 1,
        }

        place.keywordSearch(searchValue, (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
                let keywordSearchList: searchListInterface[] = []

                for (let i = 0; i < data.slice(0, 10).length; i++) {
                    keywordSearchList.push({
                        id: Number(data[i].id),
                        place: data[i].place_name,
                        lat: data[i].y,
                        lng: data[i].x,
                        address: data[i].address_name,
                        url: data[i].place_url,
                        img: "",
                        social: "카카오맵",
                        place_icon: getConvertCodeToType(data[i].category_group_code as CategoryCode)
                    })
                }

                setSearchList(keywordSearchList)
                props.setSearchList(keywordSearchList)
            }
        }, options)
    }

    const setRecommendList = async () => {
        let keywordSearchList: searchListInterface[] = []

        const codes = getRandomCode()

        for (const code of codes) {
            let tempSearchList: searchListInterface = await getCategoryRoute(code)
            keywordSearchList.push(tempSearchList)
        }

        setSearchList(keywordSearchList)
        props.setSearchList(keywordSearchList)
    }

    const addSearchList = (params: searchListInterface) => {
        props.setPlaceList(params.place, params.lat, params.lng, params.address, params.place_icon)
    }

    useEffect(() => {
        setSearchList([])
        props.setSearchList([])
    }, [props.placeId]);

    return (
        <>
            <div className={"travel_search_section"}>
                <div className="search_button_div">
                    <div className="close_div">
                        <MdClose className="close_icon" onClick={() => {
                            props.setAddList(false)
                            props.setSearchList([])
                        }}/>
                    </div>
                    <div className="keyword_input_div">
                        <input
                            type="text"
                            placeholder="검색할 키워드를 입력하세요."
                            className="scoredream-500 default_text keyword_input"
                            value={searchValue}
                            onChange={(event) => {changeSearchValue(event.target.value)}}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setKeywordList()
                                }
                            }}
                        />
                    </div>
                    <button className="search_btn_keyword" onClick={() => setKeywordList()}>
                        <FaSearch className="keyword_icon"/>
                        <span className="scoredream-500">키워드로 검색</span>
                    </button>
                    <button className="search_btn_recommend" onClick={() => setRecommendList()}>
                        <MdAutoAwesome className="recommend_icon"/>
                        <span className="scoredream-500">추천 장소</span>
                    </button>
                </div>
                <div className="search_list_div">
                    {!!searchList && searchList?.length > 0 ?
                        searchList?.map((item, index) => (
                            <div className="search_item_section" key={index}>
                                <div className="item_img_div" onClick={() => {
                                    props.setCenter(Number(item.lat), Number(item.lng))
                                }}>
                                    <span className="scoredream-700 default_text num">{index + 1}</span>
                                    {/*<Image width={408} height={306} src={null} alt={item.place} className="item_img"/>*/}
                                </div>
                                <div className="item_info_div" onClick={() => {
                                    props.setCenter(Number(item.lat), Number(item.lng))
                                }}>
                                    <span className="scoredream-700 default_text place">{item.place}</span>
                                    <span className="scoredream-500 grey_text address">{item.address}</span>
                                    <Link href={item.url} target="_blank" className="to_url">
                                        <span className="scoredream-500 gaemigul_guide to_url_span">{item.social}(으)로 바로가기{" >"}</span>
                                    </Link>
                                </div>
                                <div className="item_add_div">
                                    <FaPlus className={!!props.placeList && props.placeList?.length < 10 ? "item_add_button" : "item_add_button disabled"} onClick={() => {
                                        if (!!props.placeList && props.placeList?.length < 10) addSearchList(item)
                                    }}/>
                                </div>
                            </div>
                        )) :
                        <div className="search_list_nothing">
                            <span className="scoredream-700 grey_text">키워드를 검색하거나<br/>추천 장소를 찾아보세요.</span>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default TravelSearch;