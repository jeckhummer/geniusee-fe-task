export type ITimeSpanReport = {
    date: string;
    confirmed: number;
    confirmedDiff: number;
    deaths: number;
    deathsDiff: number;
}[];

export type IStatesReportByDate = {
    name: string;
    date: string;
    confirmed: number;
    deaths: number;
}[];
