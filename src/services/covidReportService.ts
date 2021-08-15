import dayjs from "dayjs";

import { IDetailedReportPerDate, ITimeSpanReport } from "../models";
import { checkExhaustiveness } from "../utils";
import { ICovidAPIClient, ICovidReportService, IDateHelper, ICovidClientShortReport, ITimeSpanReportParams } from "./models";

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
            case 'from_beginning_per_month':
                start = this.dateHelper.roundToMonth(params.date);
                end = start.add(1, 'month').subtract(1, 'day');
                start = start.subtract(1, 'day');
                break;
            default:
                checkExhaustiveness(params);
        }

        // here we get one extra day at the start to calculate correct death/confirmed diff
        const dates = this.dateHelper.getDatesRange(start, end);
        const shortReports = (await Promise.all(
            dates.map(x =>
                this.client.getShortReport(x, CovidReportService.DEFAULT_COUNTRY_ISO_CODE)
            )
        )).filter(Boolean);

        return CovidReportService.convertToTimeSpanReport(shortReports)
            // here we remove extra day from the start
            .filter(x => x.date.isAfter(start));
    }

    public getDetailedReportPerDate = (date: dayjs.ConfigType): Promise<IDetailedReportPerDate> => {
        throw 'aaa';
    }

    public getEarliestAvailableReportDate = (): dayjs.ConfigType => {
        return new Date(2020, 0, 22); // 22 Jan 2020
    }

    private static convertToTimeSpanReport = (shortReports: (ICovidClientShortReport | null)[]): ITimeSpanReport => {
        return shortReports.reduce<ITimeSpanReport>((acc, short, i) => {
            if (short) {
                const prev = acc[i - 1];
                const item: ITimeSpanReport[0] = {
                    date: dayjs(short.date),
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
}
