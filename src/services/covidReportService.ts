import dayjs from "dayjs";

import { IStatesReportByDate, ITimeSpanReport } from "../models";
import {
    ICovidApiClient,
    ICovidReportService,
    IDateHelper,
    ICovidClientShortReport,
    ICovidClientFullReport
} from "./models";

export class CovidReportService implements ICovidReportService {
    private static DEFAULT_COUNTRY_ISO_CODE = 'USA';

    public constructor(
        private readonly client: ICovidApiClient,
        private readonly dateHelper: IDateHelper,
    ) { }

    public getTimeSpanReport = async (start: dayjs.ConfigType, end: dayjs.ConfigType): Promise<ITimeSpanReport> => {
        // here we get one extra day at the start to calculate correct death/confirmed diff
        // (sometimes diffs from API are incorrect ¯\_(ツ)_/¯)
        const dates = this.dateHelper.getDatesRange(dayjs(start).subtract(1, 'day'), end);
        const shortReports = (await Promise.all(
            dates.map(x =>
                this.client.getShortReport(x, CovidReportService.DEFAULT_COUNTRY_ISO_CODE)
                    // to avoid Promise.all rejection
                    .catch(() => null)
            )
            // remove days with no data (sometimes it happens)
        )).filter(Boolean) as ICovidClientShortReport[];

        return CovidReportService.convertToTimeSpanReport(shortReports)
            // remove extra day from the start
            .filter(x => dayjs(x.date).isAfter(start));
    }

    public getStatesReportByDate = async (date: dayjs.ConfigType): Promise<IStatesReportByDate> => {
        const response = await this.client.getFullReport(date, CovidReportService.DEFAULT_COUNTRY_ISO_CODE)
            .catch(() => null);

        return response
            ? response
                .map(CovidReportService.convertToStateReportByDate)
                // remove strange state named 'Recovered' coming from API ¯\_(ツ)_/¯
                .filter(x => x.name !== 'Recovered')
            : [];
    }

    public getEarliestAvailableReportDate = (): dayjs.Dayjs => {
        return dayjs('2020-01-22');
    }

    private static convertToTimeSpanReport = (shortReports: ICovidClientShortReport[]): ITimeSpanReport => {
        return shortReports.reduce<ITimeSpanReport>((acc, short, i) => {
            if (short) {
                const prev = acc[i - 1];
                const item: ITimeSpanReport[0] = {
                    date: short.date,
                    confirmed: short.confirmed,
                    confirmedDiff: short.confirmed - (prev?.confirmed ?? 0),
                    deaths: short.deaths,
                    deathsDiff: short.deaths - (prev?.deaths ?? 0),
                };
                acc.push(item);
            }

            return acc;
        }, []);
    }

    private static convertToStateReportByDate = (report: ICovidClientFullReport[0]): IStatesReportByDate[0] => {
        return {
            date: report.date,
            name: report.region.province,
            confirmed: report.confirmed,
            deaths: report.deaths,
        };
    }
}
