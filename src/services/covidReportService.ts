import dayjs from "dayjs";

import { IStatesReportByDate, ITimeSpanReport } from "../models";
import { checkExhaustiveness } from "../utils";
import {
    ICovidAPIClient,
    ICovidReportService,
    IDateHelper,
    ICovidClientShortReport,
    ITimeSpanReportParams,
    ICovidClientFullReport
} from "./models";

export class CovidReportService implements ICovidReportService {
    private static DEFAULT_COUNTRY_ISO_CODE = 'USA';

    public constructor(
        private readonly client: ICovidAPIClient,
        private readonly dateHelper: IDateHelper,
    ) { }

    public getTimeSpanReport = async (params: ITimeSpanReportParams): Promise<ITimeSpanReport> => {
        const now = dayjs();
        let start: dayjs.ConfigType;
        let end: dayjs.ConfigType = now;

        switch (params.period) {
            case 'last_week':
                start = now.subtract(1, 'week');
                break;
            case 'last_month':
                start = now.subtract(1, 'month').subtract(1, 'day');
                break;
            case 'from_beginning_by_month':
                start = this.dateHelper.roundToMonth(params.date);
                end = start.add(1, 'month').subtract(1, 'day');
                start = start.subtract(1, 'day');
                break;
            default:
                checkExhaustiveness(params);
        }

        // here we get one extra day at the start to calculate correct death/confirmed diff
        // (sometimes diffs from API are incorrect...)
        const dates = this.dateHelper.getDatesRange(start, end);
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

    public getEarliestAvailableReportDate = (): dayjs.ConfigType => {
        return new Date(2020, 0, 22); // 22 Jan 2020
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
