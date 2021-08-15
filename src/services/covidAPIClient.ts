import { AxiosInstance } from "axios";
import dayjs from 'dayjs';
import QueryString from "qs";

import { ICovidAPIClient, ICovidClientFullReport, IFullReportParams, ICovidClientShortReport } from "./models";

export class CovidAPIClient implements ICovidAPIClient {
    public constructor(private readonly axiosInstance: AxiosInstance) { }

    public getShortReport = async (date: dayjs.ConfigType, countryISOCode: string): Promise<ICovidClientShortReport | null> => {
        const qs = QueryString.stringify({
            date: this.formatDate(date),
            iso: countryISOCode,
        }, { addQueryPrefix: true });
        const report = (await this.axiosInstance.get<{ data: ICovidClientShortReport }>(
            `https://covid-api.com/api/reports/total${qs}`
        )).data.data;

        return report.date ? report : null;
    }

    public getFullReport = async ({
        date,
        countryISOCode,
        page,
        pageSize,
    }: IFullReportParams): Promise<ICovidClientFullReport> => {
        const qs = QueryString.stringify({
            date: this.formatDate(date),
            iso: countryISOCode,
            page,
            per_page: pageSize,
        }, { addQueryPrefix: true });

        return (await this.axiosInstance.get(`https://covid-api.com/api/reports${qs}`)).data;
    }

    private formatDate = (date: dayjs.ConfigType) => {
        return dayjs(date).format('YYYY-MM-DD');
    }
}