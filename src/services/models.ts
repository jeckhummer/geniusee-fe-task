import { AxiosInstance } from "axios";
import dayjs from "dayjs";
import { IStatesReportByDate, ITimeSpanReport } from "../models";

export interface ICovidClientShortReport {
    date: string;
    confirmed: number;
    confirmed_diff: number;
    deaths: number;
    deaths_diff: number;
    recovered: number;
    recovered_diff: number;
    active: number;
    active_diff: number;
    fatality_rate: number;
}

export type ICovidClientFullReport = {
    date: string;
    confirmed: number;
    deaths: number;
    recovered: number;
    confirmed_diff: number;
    deaths_diff: number;
    recovered_diff: number;
    last_update: string;
    active: number;
    active_diff: number;
    fatality_rate: number;
    region: {
        iso: string;
        name: string;
        province: string;
        lat: string;
        long: string;
        cities: unknown; // not unteresting to us
    };
}[];

export interface ICovidAPIClient {
    getShortReport: (date: dayjs.ConfigType, countryISOCode: string) => Promise<ICovidClientShortReport | null>;
    getFullReport: (date: dayjs.ConfigType, countryISOCode: string) => Promise<ICovidClientFullReport>;
}

export type ITimeSpanReportParams = {
    period: 'last_week' | 'last_month'
} | {
    period: 'from_beginning_by_month';
    date: dayjs.ConfigType;
};

export interface ICovidReportService {
    getTimeSpanReport: (params: ITimeSpanReportParams) => Promise<ITimeSpanReport>;
    getStatesReportByDate: (date: dayjs.ConfigType) => Promise<IStatesReportByDate>;
    getEarliestAvailableReportDate: () => dayjs.ConfigType;
}

export interface IAxiosService {
    getInstance(): AxiosInstance;
}

export interface IDateHelper {
    roundToDate: (datetime: dayjs.ConfigType) => dayjs.Dayjs;
    roundToMonth: (datetime: dayjs.ConfigType) => dayjs.Dayjs;
    getDatesRange: (start: dayjs.ConfigType, end: dayjs.ConfigType) => dayjs.Dayjs[];
}
