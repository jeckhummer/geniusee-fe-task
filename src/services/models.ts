import { AxiosInstance } from "axios";
import dayjs from "dayjs";
import { IDetailedReportPerDate, ITimeSpanReport } from "../models";

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

interface ICovidClientPaginator {
    current_page: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url?: string;
    prev_page_url?: string;
    per_page: string;
    last_page: number;
    from: number;
    path: string;
    to: number;
    total: number;
}

export interface ICovidClientFullReport extends ICovidClientPaginator {
    data: {
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
    }
}

export interface IFullReportParams {
    date: dayjs.ConfigType;
    countryISOCode: string;
    page: number;
    pageSize: number;
}

export interface ICovidAPIClient {
    getShortReport: (date: dayjs.ConfigType, countryISOCode: string) => Promise<ICovidClientShortReport | null>;
    getFullReport: (params: IFullReportParams) => Promise<ICovidClientFullReport>;
}

export type ITimeSpanReportParams = {
    period: 'last_week' | 'last_month'
} | {
    period: 'from_beginning_per_month';
    date: dayjs.ConfigType;
};

export interface ICovidReportService {
    getTimeSpanReport: (params: ITimeSpanReportParams) => Promise<ITimeSpanReport>;
    getDetailedReportPerDate: (date: dayjs.ConfigType) => Promise<IDetailedReportPerDate>;
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
