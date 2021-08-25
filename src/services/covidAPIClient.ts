import { AxiosInstance } from "axios";
import dayjs from 'dayjs';
import QueryString from "qs";

import { ICovidApiClient, ICovidClientFullReport, ICovidClientShortReport } from "./models";

export class CovidApiClient implements ICovidApiClient {
    public constructor(private readonly axiosInstance: AxiosInstance) { }

    public getShortReport = async (date: dayjs.ConfigType, countryISOCode: string): Promise<ICovidClientShortReport | null> => {
        const qs = QueryString.stringify({
            date: this.formatDate(date),
            iso: countryISOCode,
        }, { addQueryPrefix: true });
        const report = (await this.axiosInstance.get<{ data: ICovidClientShortReport }>(
            `https://covid-api.com/api/reports/total${qs}`
        )).data.data;

        // API returns {data: []} if no data is available for specified date
        return report.date ? report : null;
    }

    public getFullReport = async (date: dayjs.ConfigType, countryISOCode: string): Promise<ICovidClientFullReport> => {
        const qs = QueryString.stringify({
            date: this.formatDate(date),
            iso: countryISOCode,
        }, { addQueryPrefix: true });

        return (await this.axiosInstance.get<{ data: ICovidClientFullReport }>(
            `https://covid-api.com/api/reports${qs}`
        )).data.data;
    }

    private formatDate = (date: dayjs.ConfigType) => {
        return dayjs(date).format('YYYY-MM-DD');
    }
}