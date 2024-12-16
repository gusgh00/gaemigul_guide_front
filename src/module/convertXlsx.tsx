import {dateListInterface, placeListInterface} from "@interface/TravelInterface";
import * as XLSX from 'xlsx';
import dayjs from "dayjs";


export const convertDateList = async (dateList: dateListInterface[], amount: string) => {
    const workBook = XLSX.utils.book_new()

    const header = [[
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
    ]]

    for (let i = 0; i < dateList.length; i++) {
        let sheetData = [
            {
                data0 : "",
                data1 : "여행지",
                data2 : "",
                dataX : "",
                data3 : "인원 수",
                data4 : "",
                data5 : "총 비용",
                data6 : "",
                dataY : "",
                data7 : "",
            }
        ]

        sheetData.push({
            data0 : "",
            data1 : dateList[i].destination,
            data2 : "",
            dataX : "",
            data3 : dateList[i].people.toString() + " 명",
            data4 : "",
            data5 : amount,
            data6 : "",
            dataY : "시작 시간",
            data7 : dayjs(dateList[i].start_time).format("HH:mm"),
        })
        const placeList = dateList[i].place_list

        sheetData.push({
            data0 : "순번",
            data1 : "장소명",
            data2 : "주소",
            dataX : "",
            data3 : "머무는 비용",
            data4 : "머무는 시간",
            data5 : "이동 비용",
            data6 : "이동 시간",
            dataY : "",
            data7 : "",
        })

        for (let j = 0; j < placeList.length; j++) {
            sheetData.push({
                data0 : (j + 1).toString(),
                data1 : placeList[j].place,
                data2 : placeList[j].address,
                dataX : "",
                data3 : (placeList[j].stay_amount * 10000).toString() + " 원",
                data4 : dayjs(placeList[j].stay_time).format("HH시간 mm분"),
                data5 : (placeList[j].move_amount * 10000).toString() + " 원",
                data6 : dayjs(placeList[j].move_time).format("HH시간 mm분"),
                dataY : "",
                data7 : "",
            })

            if (j !== placeList.length - 1) {
                sheetData.push({
                    data0 : "",
                    data1 : placeList[j].place,
                    data2 : "",
                    dataX : "",
                    data3 : "",
                    data4 : "",
                    data5 : "",
                    data6 : "",
                    dataY : "출발 시간",
                    data7 : dayjs(placeList[j].start_time).format("HH:mm"),
                })

                let routeList = placeList[j].route

                for (let k = 0; k < routeList.length; k++) {
                    sheetData.push({
                        data0 : "",
                        data1 : routeList[k].name === "" ? "일반도로" : routeList[k].name,
                        data2 : "",
                        dataX : "거리",
                        data3 : routeList[k].distance > 1000 ? (routeList[k].distance / 1000).toFixed(3) + "km" : routeList[k].distance.toFixed(3) + "m",
                        data4 : "",
                        data5 : "",
                        data6 : "",
                        dataY : "",
                        data7 : "",
                    })
                }

                sheetData.push({
                    data0 : "",
                    data1 : placeList[j + 1].place,
                    data2 : "",
                    dataX : "",
                    data3 : "",
                    data4 : "",
                    data5 : "",
                    data6 : "",
                    dataY : "도착 시간",
                    data7 : dayjs(placeList[j].end_time).format("HH:mm"),
                })
            }
        }

        const workSheet = XLSX.utils.json_to_sheet(sheetData)
        const cols = [
            {wch: 5},{wch: 20},{wch: 20},{wch: 5},{wch: 15},{wch: 15},{wch: 15},{wch: 15},{wch: 10},{wch: 10}
        ]
        workSheet["!cols"] = cols
        XLSX.utils.sheet_add_aoa(workSheet, header);
        XLSX.utils.book_append_sheet(workBook, workSheet, dateList[i].date)
    }

    XLSX.writeFile(workBook,"개미굴가이드_" + dateList[0].date + '-' + dateList[dateList.length - 1].date + '.xlsx')
}