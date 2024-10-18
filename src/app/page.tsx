"use client"
import Link from 'next/link';
import React, {forwardRef, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import {MdOutlineDateRange} from "react-icons/md";
import axios from "axios";
import {addDays} from "date-fns";
require('react-datepicker/dist/react-datepicker.css')

export default function Home() {
  interface regionListInterface {
    y_coor: string,
    full_addr: string,
    x_coor: string,
    addr_name: string,
    region_name: string,
    cd: string
  }

  const selectList = ["서울", "부산", "제주도", "대구", "광주", "대전"];
  const [regionTopList, setRegionTopList] = useState<regionListInterface[]>([{
    addr_name: "서울특별시",
    region_name: "서울",
    cd: "11",
    full_addr: "서울특별시",
    x_coor: "953932",
    y_coor: "1952053"
  }])
  const [regionTop, setRegionTop] = useState<regionListInterface>({
    addr_name: "서울특별시",
    region_name: "서울",
    cd: "11",
    full_addr: "서울특별시",
    x_coor: "953932",
    y_coor: "1952053"
  })

  const [startSelected, setStartSelected] = useState("");
  const [endSelected, setEndSelected] = useState("서울");

  const [startDate, setStartDate] = useState<Date | null | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | null | undefined>(new Date());
  const [maxDate, setMaxDate] = useState<Date | null | undefined>(new Date());

  const handleChangeEndSelect = (e: React.ChangeEvent<any>) => {
    setEndSelected(e.target.value);
  }

  const handleChangeDate = (date: Date) => {
    setStartDate(date)
    setEndDate(date)
  }

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

  const replaceRegionName = (name: string) => {
    if (name.includes("특별")) {
      return name.split("특별")[0]
    }
    else if (name.includes("광역")) {
      return name.split("광역")[0]
    }
    else if (name.includes("남도") || name.includes("북도")) {
      let tempArray = Array.from(name)
      return tempArray[0] + tempArray[2]
    }
    else {
      return name.split("도")[0]
    }
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
            let data = response.data.result
            let resultData: regionListInterface[] = []
            for (let i = 0; i < data.length; i++) {
              resultData.push({
                y_coor: data[i].y_coor,
                full_addr: data[i].full_addr,
                x_coor: data[i].x_coor,
                addr_name: data[i].addr_name,
                region_name: replaceRegionName(data[i].addr_name),
                cd: data[i].cd
              })
            }
            setRegionTopList(resultData)
          }
        })
  }

  useEffect(() => {
    getRegionTop().then()
  }, [])

  useEffect(() => {
    setRegionTop(regionTopList.filter(item => item.region_name === endSelected)[0])
  }, [endSelected]);

  return (
      <div id="main_content">
        <div className="main_page_section main_introduce main_inner">
          <div className="introduce_display">
            <div className="introduce_title">
              <span className="scoredream-900 introduce_title_span">멋진 여행을 원하시나요?</span>
              <span className="scoredream-900 introduce_title_span"><span className="scoredream-900 introduce_title_span_highlight">개미굴 가이드</span>에서</span>
              <span className="scoredream-900 introduce_title_span">도와드립니다!</span>
            </div>
            <div className="introduce_ticket">
              <div className="ticket_top">
                <div className="ticket_place">
                  {/*<select className="scoredream-700 default_text ticket_place_from" onChange={(event) => handleChangeStartSelect(event)} value={startSelected}>*/}
                  {/*  {selectList.map((item) => (*/}
                  {/*      <option value={item} key={item}>*/}
                  {/*        {item}*/}
                  {/*      </option>*/}
                  {/*  ))}*/}
                  {/*</select>*/}
                  <span className="scoredream-700 default_text ticket_place_from">개미굴</span>

                  <select className="scoredream-700 default_text ticket_place_to" onChange={(event) => handleChangeEndSelect(event)} value={endSelected}>
                    {regionTopList.map((item, index) => (
                        <option value={item.region_name} key={index}>
                          {item.region_name}
                        </option>
                    ))}
                  </select>
                </div>
                <div className="ticket_start">
                  {/*<span className="scoredream-700 default_text no_select">{startDate && startDate?.getFullYear()}년 {startDate && startDate?.getMonth() + 1}월 {startDate && startDate?.getDate()}일</span>*/}
                  <DatePicker
                      showIcon
                      toggleCalendarOnIconClick
                      dateFormat="yyyy년 MM월 dd일"
                      id="start_date_picker"
                      selected={startDate}
                      onChange={(date: Date | null) => date && handleChangeDate(date)}
                      minDate={new Date()}
                      className="scoredream-700 default_text ticket_date_text datepicker"
                      icon={
                        <MdOutlineDateRange className="date_icon"/>
                      }
                  />
                </div>
                <div className="ticket_end">
                  {/*<span className="scoredream-700 default_text no_select">{endDate && endDate?.getFullYear()}년 {endDate && endDate?.getMonth() + 1}월 {endDate && endDate?.getDate()}일</span>*/}
                  <DatePicker
                      showIcon
                      toggleCalendarOnIconClick
                      dateFormat="yyyy년 MM월 dd일"
                      id="end_date_picker"
                      selected={endDate}
                      onChange={(date: Date | null) => date && setEndDate(date)}
                      minDate={startDate ? startDate : new Date(new Date().setDate(new Date().getDate() + 4))}
                      maxDate={addDays(startDate ? startDate : new Date(), 4)}
                      className="scoredream-700 default_text ticket_date_text datepicker"
                      icon={
                        <MdOutlineDateRange className="date_icon"/>
                      }
                  />
                </div>
              </div>
              <div className="ticket_button">
                <Link href={{
                  pathname: "/travel",
                  query: {
                    region: JSON.stringify(regionTop),
                    start: startDate && new Date(startDate).toISOString(),
                    end: endDate && new Date(endDate).toISOString()
                  }}}></Link>
              </div>
              <div className="ticket_bottom">
                <div className="ticket_front">
                </div>
                <div className="ticket_back">
                  <span className="scoredream-500 white_text">여행 계획하러 가기</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*<div className="main_page_section main_board main_inner">*/}
        {/*  <div className="board_display">*/}

        {/*  </div>*/}
        {/*</div>*/}
        <div className="main_page_section main_contact main_inner">
          <div className="contact_display">
            <div className="contact_title">
              <span className="scoredream-700 contact_title_span">여러분들의 응원을 기다리고 있습니다!</span>
            </div>
            <div className="contact_button_section">
              <div className="contact_donate">
                <Link href="https://toon.at/donate/gaemigul" target="_blank">
                  <div className="contact_donate_button">
                    <span className="scoredream-500 contact_donate_span">후원</span><br/>
                  </div>
                </Link>
              </div>
              <div className="contact_inquiry">
                <Link href="mailto:gaemigul.guide@gmail.com" target="_blank">
                  <div className="contact_inquiry_button">
                    <span className="scoredream-500 contact_inquiry_span">문의</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
