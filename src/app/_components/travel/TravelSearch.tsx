"use client"
import React, {useEffect, useRef, useState} from "react";
import {MdAutoAwesome, MdClose, MdPlace} from "react-icons/md";
import {FaPlus, FaQuestion, FaSearch} from "react-icons/fa";
import Link from "next/link";

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
    stay_time: Date,
    stay_amount: string,
    vehicle_type: number,
    vehicle_icon: JSX.Element,
    vehicle_name: string,
    move_time: Date,
    move_amount: string,
    path_hide: boolean,
    start_time: Date,
    end_time: Date,
    path: placeListPath[],
    path_color: string
}

const TravelSearch = (props: {
    placeList: placeListInterface[],
    placeId: number,
    setCenter: (lat: number, lng: number) => void,
    setPlaceList: (place: string, lat: string, lng: string, address: string) => void
    setAddList: (status: boolean) => void
}) => {
    interface searchListInterface {
        id: number,
        place: string,
        lat: string,
        lng: string,
        address: string,
        url: string,
        img: string,
        social: string,
    }

    const [searchValue, setSearchValue] = useState("")
    const [searchList, setSearchList] = useState<searchListInterface[]>([]);

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
            "CE7" as kakao.maps.CategoryCode //카페
        ]
        const defaultPbtArr = [12, 11, 11, 11, 11, 11, 11, 11, 11]
        const carPbtArr = [10, 0, 10, 20, 20, 10, 10, 10, 10]
        const cyclePbtArr = [10, 30, 0, 12, 0, 12, 12, 12, 12]
        const BusPbtArr = [0, 10, 10, 0, 0, 20, 20, 20, 20]
        const WalkingPbtArr = [0, 10, 10, 0, 0, 20, 20, 20, 20]
        const lastPbtArr = [40, 20, 20, 10, 0, 0, 0, 10, 0]

        /*기본 (default), 도보, 자가용, 대중교통, 자전거*/
        /*기본 (default), 숙박, 맛집, 관람, 레저, 쉼터, 쇼핑*/
        const currentPlace = props.placeList.find(item => item.id === props.placeId)

        const weights: { [key: string]: number } = {};
        categoryCodeArr.forEach((category, index) => {
            weights[category] = carPbtArr[index];
        });

        let res: kakao.maps.CategoryCode[] = []
        for (let j = 0; j < 10; j++) {
            let randNum = Math.random() * 100
            let cumulativeWeight = 0

            for (const category of categoryCodeArr) {
                cumulativeWeight += weights[category];
                if (randNum < cumulativeWeight) {
                    return category
                }
            }
        }
        return "AD5"
    }

    const changeSearchValue = (value: string) => {
        setSearchValue(value)
    }

    const setKeywordList = () => {
        const place = new kakao.maps.services.Places()
        const options = {
            size: 10,
            page: 1,
            // location: new kakao.maps.LatLng(Number(placeList.find(item => item.id === props.placeId)?.lat), Number(placeList.find(item => item.id === props.placeId)?.lng)),
            // sort: kakao.maps.services.SortBy.DISTANCE,
            // radius: 20000,
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
                    })
                }

                setSearchList(keywordSearchList)
            }
        }, options)
    }

    const setRecommendList = () => {
        const place = new kakao.maps.services.Places()
        const options = {
            size: 10,
            page: 1,
            location: new kakao.maps.LatLng(Number(props.placeList.find(item => item.id === props.placeId)?.lat), Number(props.placeList.find(item => item.id === props.placeId)?.lng)),
            sort: kakao.maps.services.SortBy.DISTANCE,
            radius: 1000,
        }

        const code = getRandomCode()
        place.categorySearch(code as kakao.maps.CategoryCode, (data, status, pagination) => {
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
                    })
                }
                setSearchList(keywordSearchList)
            }
        }, options)
    }

    const addSearchList = (params: searchListInterface) => {
        props.setPlaceList(params.place, params.lat, params.lng, params.address)
    }

    useEffect(() => {
        setSearchList([])
    }, [props.placeId]);

    return (
        <>
            <div className={"travel_search_section"}>
                <div className="search_button_div">
                    <div className="close_div">
                        <MdClose className="close_icon" onClick={() => {
                            props.setAddList(false)
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