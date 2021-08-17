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
    span: 'last_week' | 'last_month'
} | {
    span: 'from_beginning_by_month';
    month: dayjs.ConfigType;
};

export interface ICovidReportService {
    getTimeSpanReport: (start: dayjs.ConfigType, end: dayjs.ConfigType) => Promise<ITimeSpanReport>;
    getStatesReportByDate: (date: dayjs.ConfigType) => Promise<IStatesReportByDate>;
    getEarliestAvailableReportDate: () => dayjs.Dayjs;
}

export interface IAxiosService {
    getInstance(): AxiosInstance;
}

export interface IDateHelper {
    roundToDate: (datetime: dayjs.ConfigType) => dayjs.Dayjs;
    roundToMonth: (datetime: dayjs.ConfigType) => dayjs.Dayjs;
    getDatesRange: (start: dayjs.ConfigType, end: dayjs.ConfigType) => dayjs.Dayjs[];
    stringifyMonthForUrl: (date: dayjs.ConfigType) => string;
    stringifyDateForUrl: (date: dayjs.ConfigType) => string;
}
