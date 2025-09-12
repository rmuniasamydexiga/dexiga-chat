import dayjs, { ManipulateType } from "dayjs";

export const dayFormat = (value: string, type: string) => {
    let date = dayjs(value).format(type)
    return date
}
export const dayFormatwithUnix = (value: any, type: string) => {

    if (value?.seconds) {
        const date = new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        return formattedTime
    } else {
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        return formattedTime
        
    }


}
export const dayDate = (value: any) => {
    if (value) {
        const date = new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
        const localTimestamp = date.toLocaleString();
        return localTimestamp
    } else {
        return '_'
    }


}


export const daySubtract = (value: Date, unit: number, type: ManipulateType) => {
    let date = new Date();
    date.setDate(date.getDate() - 5)
    return date
}