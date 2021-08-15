import dayjs from "dayjs";

export type ITimeSpanReport = {
    date: dayjs.Dayjs;
    confirmed: number;
    confirmedDiff: number;
    deaths: number;
    deathsDiff: number;
}[];

export type IDetailedReportPerDate = {
    date: dayjs.Dayjs;
    totalConfirmed: number;
    totalDeaths: number;
    states: {
        name: string;
        confirmed: number;
        deaths: number;
    }[]
};
