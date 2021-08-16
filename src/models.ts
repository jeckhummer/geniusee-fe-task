import dayjs from "dayjs";

export type ITimeSpanReport = {
    date: dayjs.Dayjs;
    confirmed: number;
    confirmedDiff: number;
    deaths: number;
    deathsDiff: number;
}[];

export type IStatesReportByDate = {
    name: string;
    date: dayjs.Dayjs;
    confirmed: number;
    deaths: number;
}[];
