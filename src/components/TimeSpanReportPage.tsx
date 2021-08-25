import dayjs from 'dayjs';
import * as React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Loader, Message } from 'semantic-ui-react';

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
    },
    onDateClick: (date: string) => void,
    onInvalidUrlParams: (params: { span: Span, month: string | undefined }) => void,
}> = ({ urlParams, onInvalidUrlParams, onDateClick }) => {
    const { covidReportService, dateHelper } = useServices();
    const timeSpanReport = useAppSelector(s => s.timeSpanReport);
    const dispatch = useAppDispatch();

    const [series, categories] = React.useMemo(() => {
        if (timeSpanReport.status === 'success') {
            const series: { name: string, data: number[] }[] = [
                { name: 'Deaths diff', data: [] },
                { name: 'Confirmed diff', data: [] },
            ];
            const categories: string[] = [];

            timeSpanReport.data.forEach(x => {
                categories.push(x.date);

                series[0].data.push(x.deathsDiff + 1000);
                series[1].data.push(x.confirmedDiff);
            });

            return [series, categories];
        } else {
            return [];
        }
    }, [timeSpanReport]);

    React.useEffect(() => {
        const now = dayjs();

        // url params sanitization
        const span = urlParams.span && isValidTimeSpan(urlParams.span)
            ? urlParams.span
            : 'lastMonth';
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

    const options: ApexCharts.ApexOptions = React.useMemo(() => ({
        colors: ['#ff6b6b', '#f9ca24'],
        chart: {
            toolbar: {
                show: false,
            },
            events: {
                dataPointSelection: function (_, __, { dataPointIndex }) {
                    onDateClick(timeSpanReport.data[dataPointIndex].date);
                }
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 0,
                horizontal: false,
            },
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            type: 'datetime',
            categories,
        },
        legend: {
            position: 'top',
            offsetY: 10,
        },
        fill: {
            opacity: 1,
        },
    }), []);

    return (
        <>
            {(() => {
                if (timeSpanReport.status === 'success') {
                    return (
                        <>
                            <ReactApexChart
                                type="bar"
                                series={series}
                                height={350}
                                options={options}
                            />
                        </>
                    );
                } else if (timeSpanReport.status === 'loading') {
                    return <Loader active />
                } else if (timeSpanReport.status === 'error') {
                    return <Message error>{timeSpanReport.error?.message}</Message>;
                } else {
                    return null;
                }
            })()}
        </>
    );
};