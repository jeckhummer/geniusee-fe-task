import dayjs from 'dayjs';
import * as React from 'react';

import { useAppDispatch, useAppSelector } from "../hooks";
import { useServices } from "../services";
import { getTimeSpanReport } from "../store";
import { checkExhaustiveness } from '../utils';

type Span = 'lastWeek' | 'lastMonth' | 'fromBeginningByMonth';
type Spans = {
    [K in Span]: string;
}
const spans: Spans = {
    lastWeek: 'Last week',
    lastMonth: 'Las month',
    fromBeginningByMonth: 'From beginning by month',
};

function isValidTimeSpan(str: string): str is Span {
    return Object.keys(spans).indexOf(str as any) > -1;
}

export const TimeSpanReportPage: React.FC<{
    urlParams: {
        span: string | undefined,
        month: string | undefined,
    };
    onInvalidUrlParams: (params: { span: Span, month: string | undefined }) => void,
}> = ({ urlParams, onInvalidUrlParams }) => {
    const { covidReportService, dateHelper } = useServices();
    const timeSpanReport = useAppSelector(s => s.timeSpanReport);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        const now = dayjs();

        // url params sanitization
        const span = urlParams.span && isValidTimeSpan(urlParams.span)
            ? urlParams.span
            : 'lastWeek';
        let month;

        if (span === 'fromBeginningByMonth') {
            const minMonth = dateHelper.roundToMonth(
                covidReportService.getEarliestAvailableReportDate()
            );

            if (urlParams.month) {
                const monthDate = dayjs(urlParams.month);

                month = dateHelper.stringifyMonthForUrl(
                    monthDate.isValid()
                        && minMonth.isBefore(monthDate)
                        && monthDate.isBefore(now)
                        ? monthDate
                        : now
                );
            }
        }

        // if there is something wrong with url params
        if (span !== urlParams.span || month !== urlParams.month) {
            onInvalidUrlParams({ span, month });
        } else {
            let start: dayjs.ConfigType;
            let end: dayjs.ConfigType = now;

            switch (span) {
                case 'lastWeek':
                    start = now.subtract(1, 'week').add(1, 'day');
                    break;
                case 'lastMonth':
                    start = now.subtract(1, 'month');
                    break;
                case 'fromBeginningByMonth':
                    start = dateHelper.roundToMonth(month);
                    end = start.add(1, 'month');
                    break;
                default:
                    checkExhaustiveness(span);
            }

            dispatch(
                getTimeSpanReport(
                    covidReportService.getTimeSpanReport(start, end)
                )
            );
        }
    }, [urlParams]);

    return (
        <>
            <pre>
                {JSON.stringify(timeSpanReport, null, 4)}
            </pre>
        </>
    );
};