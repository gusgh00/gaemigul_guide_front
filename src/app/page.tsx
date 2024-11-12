"use client"
import Link from 'next/link';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {addDays} from "date-fns";
import DatePicker from "@/app/_components/travel/GMGDatePicker";
import {regionListInterface} from "@interface/TravelInterface";
import {getAccessKey, replaceRegionName} from "@module/TravelModule";
import {dummyRegionSeoulData} from '@module/DataArrayModule'
import Footer from "@/app/_components/footer";
require('dayjs')

export default function Home() {
  const [regionTopList, setRegionTopList] = useState<regionListInterface[]>([dummyRegionSeoulData])
  const [regionTop, setRegionTop] = useState<regionListInterface>(dummyRegionSeoulData)
  const [endSelected, setEndSelected] = useState("서울");
  const [startDate, setStartDate] = useState<Date | null | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | null | undefined>(new Date());

  const handleChangeEndSelect = (e: React.ChangeEvent<any>) => {
    setEndSelected(e.target.value);
  }

  const handleChangeStartDate = (date: Date) => {
    setStartDate(date)
    setEndDate(date)
  }

  const handleChangeEndDate = (date: Date) => {
    setEndDate(date)
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

  useEffect(() => {
    let travelParams = {
      region: regionTop,
      start: startDate && new Date(startDate).toISOString(),
      end: endDate && new Date(endDate).toISOString()
    }
    localStorage.setItem("travel", JSON.stringify(travelParams))
  }, [regionTop, startDate, endDate]);

  return (
      <>
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
                    <span className="scoredream-700 default_text ticket_place_from">개미굴</span>

                    <select className="scoredream-700 default_text ticket_place_to" onChange={(event) => handleChangeEndSelect(event)} value={endSelected}>
                      {regionTopList.map((item, index) => (
                          <option value={item.region_name} key={index}>
                            {item.region_name}
                          </option>
                      ))}
                    </select>
                  </div>
                  <DatePicker
                      inline={false}
                      onChange={(date: Date) => date && handleChangeStartDate(date)}
                      minDate={new Date()}
                      selectDate={startDate ? startDate : new Date()}
                      boxClassName="ticket_start"
                      inputClassName="scoredream-700 default_text ticket_date_text datepicker"
                      iconClassName="date_icon"
                  />
                  <DatePicker
                      inline={false}
                      onChange={(date: Date) => date && handleChangeEndDate(date)}
                      minDate={startDate ? startDate : new Date(new Date().setDate(new Date().getDate() + 4))}
                      maxDate={addDays(startDate ? startDate : new Date(), 4)}
                      selectDate={endDate ? endDate : new Date()}
                      boxClassName="ticket_end"
                      inputClassName="scoredream-700 default_text ticket_date_text datepicker"
                      iconClassName="date_icon"
                  />
                </div>
                <div className="ticket_button">
                  <Link href={"/travel"}></Link>
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
                {/*<div className="contact_donate">*/}
                {/*  <Link href="https://toon.at/donate/gaemigul" target="_blank">*/}
                {/*    <div className="contact_donate_button">*/}
                {/*      <span className="scoredream-500 contact_donate_span">후원</span><br/>*/}
                {/*    </div>*/}
                {/*  </Link>*/}
                {/*</div>*/}
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
        <Footer/>
      </>
  );
}
