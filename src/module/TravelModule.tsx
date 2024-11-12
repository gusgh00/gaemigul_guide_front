import {
    dateListInterface,
    dropdownIconPlaceInterface,
    dropdownIconVehicleInterface,
    placeListInterface, placeListPath, placeListPublicPath
} from "@interface/TravelInterface";
import axios from "axios";
import {busRouteType, subwayRouteType} from "@module/DataArrayModule";
import exp from "constants";

export const findMaxIdLocation = (locations: placeListInterface[]) => {
    return locations.reduce((max, location) => {
        return (location.id > max.id) ? location : max;
    }, locations[0]);
};

export const replaceRegionName = (name: string) => {
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

export const getAccessKey = async () => {
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

export const getPublicTransportWalkGeometry = async (start: string, end: string) => {
    let publicPaths: placeListPublicPath[] = []

    const url = process.env.NEXT_PUBLIC_MAPBOX_URL as string
    await axios.get(url + "walking/" + start + ";" + end, {
        params: {
            geometries: "geojson",
            access_token: process.env.NEXT_PUBLIC_MAPBOX_KEY as string
        }
    })
        .then(response => {
            if (response.data.code === "Ok") {
                let coordinates: any[] = response.data.routes[0].geometry.coordinates
                let paths: placeListPath[] = []

                for (let i = 0; i < coordinates.length; i++) {
                    paths.push({
                        lat: coordinates[i][1],
                        lng: coordinates[i][0],
                    })
                }

                publicPaths.push({
                    type: 1,
                    path_color: "#7430ec",
                    path: paths
                })
            }
        })

    return publicPaths
}

export const getPublicTransportGeometry = async (mapObj: string) => {
    let publicPaths: placeListPublicPath[] = []

    const url = process.env.NEXT_PUBLIC_ODSAY_ROAD_URL as string
    await axios.get(url, {
        params: {
            mapObject: "0:0@" + mapObj,
            apiKey: process.env.NEXT_PUBLIC_ODSAY_KEY as string
        }
    })
        .then(async response => {
            for (let i = 0; i < response.data.result.lane.length; i++) {
                let lineArray: placeListPath[] = []
                for (let j = 0; j < response.data.result.lane[i].section.length; j++) {
                    for (let k = 0; k < response.data.result.lane[i].section[j].graphPos.length; k++) {
                        lineArray.push({
                            lat: response.data.result.lane[i].section[j].graphPos[k].y,
                            lng: response.data.result.lane[i].section[j].graphPos[k].x,
                        })
                    }
                }
                publicPaths.push({
                    type: 0,
                    path_color: response.data.result.lane[i].class === 1 ?
                        busRouteType.filter(item => item.type === response.data.result.lane[i].type)[0].color :
                        subwayRouteType.filter(item => item.type === response.data.result.lane[i].type)[0].color,
                    path: lineArray
                })
            }
        })
    return publicPaths
}

export const getRouteCycleAndWalking = async (startPlace: placeListInterface, endPlace: placeListInterface) => {
    let paths: placeListPath[] = []
    let time: number = 0
    let payment: number = 0 //도보와 자전거는 통행요금이 청구되지 않음

    let profiles = ""
    if (startPlace.vehicle_type === 1) {
        profiles = "walking/"
    } else if (startPlace.vehicle_type === 4) {
        profiles = "cycling/"
    }

    const url = process.env.NEXT_PUBLIC_MAPBOX_URL as string
    let startPosition = startPlace.lng + "," + startPlace.lat
    let endPosition = endPlace.lng + "," + endPlace.lat

    await axios.get(url + profiles + startPosition + ";" + endPosition, {
        params: {
            geometries: "geojson",
            access_token: process.env.NEXT_PUBLIC_MAPBOX_KEY as string
        }
    })
        .then(async response => {
            if (response.data.code === "Ok") {
                let coordinates: any[] = response.data.routes[0].geometry.coordinates
                for (let i = 0; i < coordinates.length; i++) {
                    paths.push({
                        lat: coordinates[i][1],
                        lng: coordinates[i][0],
                    })
                }
                time = response.data.routes[0].duration
                payment = 0 //도보와 자전거는 통행요금이 청구되지 않음
            }
        })
    return {paths, time, payment}
}

export const getRouteCar = async (startPlace: placeListInterface, endPlace: placeListInterface) => {
    let paths: placeListPath[] = []
    let time: number = 0
    let payment: number = 0

    const url = process.env.NEXT_PUBLIC_KAKAO_MOBILITY_URL as string
    let startPosition = startPlace.lng + "," + startPlace.lat
    let endPosition = endPlace.lng + "," + endPlace.lat

    await axios.get(url, {
        params: {
            origin: startPosition,
            destination: endPosition,
        },
        headers: {
            Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_KEY as string}`,
            "Content-Type": "application/json",
        }
    })
        .then(async response => {
            if (response.data.routes[0].result_code === 0) {
                time = response.data.routes[0].summary.duration
                payment = response.data.routes[0].summary.fare.toll / 10000

                response.data.routes[0].sections[0].roads.forEach((router: any) => {
                    router.vertexes.forEach((vertex: any, index: number) => {
                        if (index % 2 === 0) {
                            paths.push({
                                lat: router?.vertexes[index + 1],
                                lng: router?.vertexes[index],
                            })
                        }
                    })
                })
            }
        })
    return {paths, time, payment}
}

export const getRoutePublicTransport = async (startPlace: placeListInterface, endPlace: placeListInterface) => {
    let paths: placeListPublicPath[] = []
    let time: number = 0
    let payment: number = 0
    const url = process.env.NEXT_PUBLIC_ODSAY_PUBLICTRANS_URL as string
    await axios.get(url, {
        params: {
            SX: startPlace.lng,
            SY: startPlace.lat,
            EX: endPlace.lng,
            EY: endPlace.lat,
            apiKey: process.env.NEXT_PUBLIC_ODSAY_KEY as string
        }
    })
        .then(async response => {
            let tempWalkingArr: placeListPublicPath[] = []
            time = response.data.result.path[0].info.totalTime * 60
            payment = response.data.result.path[0].info.payment / 10000
            for (let j = 0; j < response.data.result.path[0].subPath.length; j++) {
                let walkingArr: placeListPublicPath[] = []
                let startPositionLatLng = ""
                let endPositionLatLng = ""
                if (response.data.result.path[0].subPath[j].trafficType === 3) {
                    if (j === 0) {
                        startPositionLatLng = startPlace.lng + "," + startPlace.lat
                        endPositionLatLng = response.data.result.path[0].subPath[j + 1].startX + "," + response.data.result.path[0].subPath[j + 1].startY
                        walkingArr = await getPublicTransportWalkGeometry(startPositionLatLng, endPositionLatLng)
                    } else if (j === response.data.result.path[0].subPath.length - 1) {
                        startPositionLatLng = response.data.result.path[0].subPath[j - 1].endX + "," + response.data.result.path[0].subPath[j - 1].endY
                        endPositionLatLng = endPlace.lng + "," + endPlace.lat
                        walkingArr = await getPublicTransportWalkGeometry(startPositionLatLng, endPositionLatLng)
                    }
                    else if (j !== 0 && j !== response.data.result.path[0].subPath.length - 1) {
                        if (response.data.result.path[0].subPath[j - 1].trafficType !== response.data.result.path[0].subPath[j + 1].trafficType) {
                            startPositionLatLng = response.data.result.path[0].subPath[j - 1].endX + "," + response.data.result.path[0].subPath[j - 1].endY
                            endPositionLatLng = response.data.result.path[0].subPath[j + 1].startX + "," + response.data.result.path[0].subPath[j + 1].startY
                            walkingArr = await getPublicTransportWalkGeometry(startPositionLatLng, endPositionLatLng)
                        }
                    }
                    tempWalkingArr = [...tempWalkingArr, ...walkingArr]
                }
            }
            let publicPaths = await getPublicTransportGeometry(response.data.result.path[0].info.mapObj)
            paths = publicPaths.concat(tempWalkingArr)
        })

    return {paths, time, payment}
}