import {set} from "date-fns";

export const changeDurationTime = (time: number) => {
    let tempHour = Math.trunc(time / 3600)
    let tempMin = Math.trunc((time % 3600) / 60)
    let tempSec = Math.trunc(time % 60)
    return set(new Date(), {
        hours: tempHour,
        minutes: tempMin,
        seconds: tempSec,
    })
}

export const changeTimeToSeconds = (time: Date) => {
    let tempHour = time.getHours()
    let tempMin = time.getMinutes()
    let tempSec = time.getSeconds()
    return (tempHour * 3600) + (tempMin * 60) + tempSec
}