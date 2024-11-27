import {set} from "date-fns";

export const changeDurationTime = (time: number) => {
    let tempHour = Math.trunc(time / 3600)
    console.log(tempHour)
    let tempMin = Math.trunc((time % 3600) / 60)
    console.log(tempMin)
    let tempSec = Math.trunc(time % 60)
    console.log(tempSec)
    console.log(set(new Date(), {
        hours: tempHour,
        minutes: tempMin,
        seconds: tempSec,
    }))
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