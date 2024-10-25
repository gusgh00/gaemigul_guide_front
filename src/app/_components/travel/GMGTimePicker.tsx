"use client"
import React, {useEffect, useRef, useState} from "react";
import {set, toDate} from "date-fns";
import dayjs from "dayjs";

const TimePicker = (props: {
    boxClassName?: string,
    inputClassName?: string,
    onChange: (date: Date) => void,
    selectTime: Date
}) => {
    const [isOpenCalendar, setOpenCalendar] = useState(false)
    const [height, setHeight] = useState(0)
    const [popupHeight, setPopupHeight] = useState(0)
    const [resultHeight, setResultHeight] = useState(0)
    const parentRef = useRef<HTMLDivElement | null>(null)
    const timerRef = useRef<HTMLDivElement | null>(null)

    const [currentHour, setCurrentHour] = useState(new Date().getHours())
    const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes())

    const [selectedTime, setSelectedTime] = useState(new Date())

    const [currentHourList, setCurrentHourList] = useState<number[]>([])
    const [currentMinList, setCurrentMinList] = useState<number[]>([])

    const handleHourClick = (timeNum: number) => {
        setCurrentHour(timeNum)
        let newTime = set(new Date(), {
            hours: timeNum,
            minutes: currentMinute
        })
        setSelectedTime(newTime)
        props.onChange(newTime)
    }

    const handleMinClick = (timeNum: number) => {
        setCurrentMinute(timeNum)
        let newTime = set(new Date(), {
            hours: currentHour,
            minutes: timeNum
        })
        setSelectedTime(newTime)
        props.onChange(newTime)
    }

    const handleSubmitClick = () => {
        setOpenCalendar(false)
    }

    const handleHourActiveStyle = (timeNum: number) => {
        if (timeNum !== currentHour) {
            return "grey_text"
        }
        else {
            return "active_date white_text"
        }
    }

    const handleMinActiveStyle = (timeNum: number) => {
        if (timeNum !== currentMinute) {
            return "grey_text"
        }
        else {
            return "active_date white_text"
        }
    }

    const changeTimeList = () => {
        const TotalHour = Array.from(
            { length: 24 },
            (_, index) => index
        );
        const TotalMin = Array.from(
            { length: 60 },
            (_, index) => index
        );
        setCurrentHourList(TotalHour)
        setCurrentMinList(TotalMin)
    }

    const formattingTime = (time: number) => {
        if (time / 10 < 1) {
            return "0" + time
        } else {
            return time
        }
    }

    useEffect(() => {
        changeTimeList()
    }, []);

    useEffect(() => {
        setHeight(Number(parentRef.current?.clientHeight))
        setResultHeight(Number(parentRef.current?.clientHeight))
    }, [])

    useEffect(() => {
        setPopupHeight(Number(timerRef.current?.clientHeight))
    }, [])

    useEffect(() => {
        let tempDate = toDate(props.selectTime)
        setSelectedTime(tempDate)
        setCurrentHour(tempDate.getHours())
        setCurrentMinute(tempDate.getMinutes())
    }, [props.selectTime]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const timer = timerRef.current;
            if (timer && !timer.contains(e.target as Node)) {
                setOpenCalendar(false)
            }
        };
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, [timerRef]);

    const changeStyleTop = () => {
        let timerRefCurrent = timerRef.current
        let inputRefCurrent = parentRef.current
        if (inputRefCurrent && timerRefCurrent) {
            const rect: DOMRect = inputRefCurrent?.getBoundingClientRect();
            if (rect.bottom + window.scrollY + timerRefCurrent?.clientHeight > window.innerHeight) {
                setResultHeight(0 - height - timerRefCurrent?.clientHeight)
            } else {
                setResultHeight(height)
            }
        } else {
            setResultHeight(height)
        }
    }

    useEffect(() => {
        if (isOpenCalendar) {
            changeStyleTop()
        }
    }, [isOpenCalendar]);

    const Timer = () => {
        return (
            <div className="gmg_timer" style={{ top: resultHeight.toString() + "px" }} ref={timerRef}>
                <div className="gmg_timer_time_section">
                    <div className="gmg_timer_hour_section">
                        {currentHourList.map(item => (
                            <span key={item} className={"scoredream-700 default_text times cursor_pointer " + handleHourActiveStyle(item)} onClick={() => handleHourClick(item)}>{formattingTime(item)}</span>
                        ))}
                    </div>
                    <div className="gmg_timer_min_section">
                        {currentMinList.map(item => (
                            <span key={item} className={"scoredream-700 default_text times cursor_pointer " + handleMinActiveStyle(item)} onClick={() => handleMinClick(item)}>{formattingTime(item)}</span>
                        ))}
                    </div>
                </div>
                <div className="gmg_timer_control">
                    <button className="control_submit_btn scoredream-500 grey_text" onClick={() => handleSubmitClick()}>적용</button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className={"gmg_time_picker_section " + props.boxClassName} ref={parentRef}>
                <input className={props.inputClassName} readOnly={true} onClick={() => {
                    setOpenCalendar(!isOpenCalendar)
                }} value={dayjs(selectedTime).format("HH:mm")}/>
                {isOpenCalendar && <Timer/>}
            </div>
        </>
    );
};

export default TimePicker;