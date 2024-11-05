"use client"
import {MdOutlineDateRange} from "react-icons/md";
import React, {useEffect, useRef, useState} from "react";
import {addDays, endOfMonth, startOfDay, startOfMonth, subDays, toDate} from "date-fns";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import dayjs from "dayjs";

const DatePicker = (props: {
    inline: boolean
    boxClassName?: string,
    inputClassName?: string,
    iconClassName?: string,
    onChange: (date: Date) => void,
    minDate?: Date,
    maxDate?: Date,
    selectDate: Date
}) => {
    const [isOpenCalendar, setOpenCalendar] = useState(false)
    const [height, setHeight] = useState(0)
    const parentRef = useRef<HTMLDivElement | null>(null)
    const calendarRef = useRef<HTMLDivElement | null>(null)

    const days = ["일", "월", "화", "수", "목", "금", "토"]

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())

    const [selectedDate, setSelectedDate] = useState(startOfDay(new  Date()))

    const [currentDateList, setCurrentDateList] = useState<number[]>([])

    const handleLowerClick = () => {
        if (currentMonth === 0) {
            setCurrentYear(currentYear - 1)
            setCurrentMonth(11)
        } else {
            setCurrentYear(currentYear)
            setCurrentMonth(currentMonth - 1)
        }
    }

    const handleUpperClick = () => {
        if (currentMonth === 11) {
            setCurrentYear(currentYear + 1)
            setCurrentMonth(0)
        } else {
            setCurrentYear(currentYear)
            setCurrentMonth(currentMonth + 1)
        }
    }

    const handleDateClick = (dateNum: number) => {
        setSelectedDate(toDate(dateNum))
        props.onChange(toDate(dateNum))
        setOpenCalendar(false)
    }

    const handleAnotherDateClick = (dateNum: number) => {
        setCurrentYear(toDate(dateNum).getFullYear())
        setCurrentMonth(toDate(dateNum).getMonth())
        setSelectedDate(toDate(dateNum))
        props.onChange(toDate(dateNum))
        setOpenCalendar(false)
    }

    const handleDateActiveStyle = (dateNum: number) => {
        if ((props.minDate && dateNum < startOfDay(props.minDate).valueOf()) || (props.maxDate && dateNum > startOfDay(props.maxDate).valueOf())) {
            return "light_grey_text cursor_not_allowed"
        } else {
            if (toDate(dateNum).getMonth() !== currentMonth) {
                return "grey_text"
            }
            else {
                if (dateNum === selectedDate.valueOf()) {
                    return "active_date white_text"
                } else {
                    if (toDate(dateNum).getMonth() === currentMonth && toDate(dateNum).toDateString() === toDate(Date.now()).toDateString()) {
                        return "gaemigul_guide"
                    } else {
                        return "default_text"
                    }
                }
            }
        }
    }

    const handleDateActiveClick = (dateNum: number) => {
        if ((props.minDate && dateNum < startOfDay(props.minDate).valueOf()) || (props.maxDate && dateNum > startOfDay(props.maxDate).valueOf())) {
            return
        } else {
            if (toDate(dateNum).getMonth() !== currentMonth) {
                return handleAnotherDateClick(dateNum)
            }
            else {
                return handleDateClick(dateNum)
            }
        }
    }

    const changeDateList = () => {
        let startDate = startOfDay(startOfMonth(new Date(currentYear, currentMonth)))
        let endDate = startOfDay(endOfMonth(new Date(currentYear, currentMonth)))

        let startDay = startDate.getDay()
        let endDay = endDate.getDay()

        let necessaryPrevMonthDay = startDay === 0 ? 0 : startDay
        let necessaryNextMonthDay = endDay === 6 ? 0 : 6 - endDay


        const PrevMonth = Array.from(
            { length: necessaryPrevMonthDay },
            (_, index) => addDays(subDays(startDate, necessaryPrevMonthDay), index).valueOf()
        );
        const CurrentMonth = Array.from(
            { length: endDate.getDate() },
            (_, index) => addDays(startDate, index).valueOf()
        );
        const NextMonth = Array.from(
            { length: necessaryNextMonthDay },
            (_, index) => addDays(endDate, index + 1).valueOf()
        );
        let timestamp = PrevMonth.concat(CurrentMonth, NextMonth)
        setCurrentDateList(timestamp)
    }

    useEffect(() => {
        changeDateList()
    }, [currentYear, currentMonth]);

    useEffect(() => {
        setHeight(Number(parentRef.current?.clientHeight))
    }, [])

    useEffect(() => {
        let tempDate = startOfDay(props.selectDate)
        setSelectedDate(tempDate)
        setCurrentYear(tempDate.getFullYear())
        setCurrentMonth(tempDate.getMonth())
    }, [props.selectDate]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const calendar = calendarRef.current;
            if (calendar && !calendar.contains(e.target as Node)) {
                setOpenCalendar(false)
            }
        };
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, [calendarRef]);

    const Calendar = () => {
        return (
            <div className="gmg_calendar" style={props.inline ? {} : { top: height.toString() + "px"}} ref={calendarRef}>
                <div className="gmg_calendar_control">
                    <button onClick={() => handleLowerClick()} className="control_prev_btn">
                        <FaChevronLeft className="control_prev_icon"/>
                    </button>
                    <div className="control_date_div">
                        <span className="scoredream-700 default_text control_date_text">{currentYear}년 {currentMonth + 1}월</span>
                    </div>
                    <button onClick={() => handleUpperClick()} className="control_next_btn">
                        <FaChevronRight className="control_next_icon"/>
                    </button>
                </div>
                <div className="gmg_calendar_days_section">
                    {days.map(item => (
                        <span key={item} className="scoredream-700 default_text days">{item}</span>
                    ))}
                </div>
                <div className="gmg_calendar_date_section">
                    {currentDateList.map(item => (
                        <span key={item} className={"scoredream-700 date cursor_pointer " + handleDateActiveStyle(item)}
                              onClick={() => handleDateActiveClick(item)}
                        >{toDate(item).getDate()}</span>
                    ))}
                </div>
            </div>
        )
    }

    return (
        props.inline
            ? <>
                <Calendar/>
            </>
            : <>
                <div className={"gmg_date_picker_section " + props.boxClassName} ref={parentRef}>
                    <input className={props.inputClassName} readOnly={true} onClick={() => setOpenCalendar(!isOpenCalendar)} value={dayjs(selectedDate).format("YYYY년 MM월 DD일")}/>
                    <MdOutlineDateRange className={props.iconClassName} onClick={() => setOpenCalendar(!isOpenCalendar)}/>
                    {isOpenCalendar && <Calendar/>}
                </div>
            </>
    );
};

export default DatePicker;