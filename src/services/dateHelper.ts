import dayjs from "dayjs";

import { IDateHelper } from "./models";

export class DateHelper implements IDateHelper {
    public roundToDate = (datetime: dayjs.ConfigType): dayjs.Dayjs => {
        return dayjs(dayjs(datetime).format("YYYY-MM-DD"));
    }

    public roundToMonth = (datetime: dayjs.ConfigType): dayjs.Dayjs => {
        return dayjs(dayjs(datetime).format("YYYY-MM"));
    }

    public getDatesRange = (start: dayjs.ConfigType, end: dayjs.ConfigType): dayjs.Dayjs[] => {
        const startDate = this.roundToDate(start);
        const endDate = this.roundToDate(end);
        const daysBetween = endDate.diff(startDate, "days");

        return this.range(0, daysBetween + 1).map(x => startDate.add(x, "day"));
    }

    public stringifyMonthForUrl = (date: dayjs.ConfigType): string => {
        return dayjs(date).format("YYYY-MM");
    }

    public stringifyDateForUrl = (date: dayjs.ConfigType): string => {
        return dayjs(date).format("YYYY-MM-DD");
    }

    private range = (start: number, end: number): number[] => {
        return Array.from(
            { length: end - start },
            (x, i) => start + i
        );
    }
}