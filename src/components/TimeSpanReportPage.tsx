import dayjs from 'dayjs';
import * as React from 'react';
import { Dropdown, Loader, Message } from 'semantic-ui-react';

import { useAppDispatch, useAppSelector } from "../hooks";
import { useServices } from "../services";
import { getTimeSpanReport } from "../store";
import { checkExhaustiveness } from '../utils';
import { Chart } from './Chart';

type Span = 'lastWeek' | 'lastMonth' | 'fromBeginning';
type Spans = {
    [K in Span]: string;
}
const spans: Spans = {
    lastWeek: 'Last week',
    lastMonth: 'Last month',
    fromBeginning: 'From beginning',
};
const dropdownOptions = Object.keys(spans)
    .map(x => ({
        value: x,
        text: spans[x as Span],
        key: x,
    }));

function isValidTimeSpan(str: string): str is Span {
    return Object.keys(spans).indexOf(str as any) > -1;
}

export const TimeSpanReportPage: React.FC<{
    urlParams: { span: string | undefined },
    onDateClick: (date: string) => void,
    onInvalidUrlParams: (params: { span: Span }) => void,
    onSpanChange: (params: { span: Span }) => void,
}> = ({ urlParams, onInvalidUrlParams, onDateClick, onSpanChange }) => {
    const { covidReportService } = useServices();
    const timeSpanReport = useAppSelector(s => s.timeSpanReport);
    const dispatch = useAppDispatch();
    const now = dayjs();

    React.useEffect(() => {
        // url params sanitization
        const span: Span = urlParams.span && isValidTimeSpan(urlParams.span)
            ? urlParams.span
            : 'lastMonth';

        // if there is something wrong with url params
        if (span !== urlParams.span) {
            onInvalidUrlParams({ span });
        } else {
            let start: dayjs.ConfigType;
            const end: dayjs.ConfigType = now;

            switch (span) {
                case 'lastWeek':
                    start = now.subtract(1, 'week').add(1, 'day');
                    break;
                case 'lastMonth':
                    start = now.subtract(1, 'month');
                    break;
                case 'fromBeginning':
                    start = covidReportService.getEarliestAvailableReportDate();
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

    if (timeSpanReport.status === 'success') {
        return (
            <>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Dropdown
                        selection
                        value={urlParams.span}
                        onChange={(_, { value }) => onSpanChange({ ...urlParams, span: value as any })}
                        options={dropdownOptions}
                    />
                </div>
                <Chart data={timeSpanReport.data} onDateClick={onDateClick} />
                <Message
                    info
                    content='You can click on the legend items to see only deaths / confirmed diffs'
                />
            </>
        );
    } else if (timeSpanReport.status === 'loading') {
        return (
            <>
                {urlParams.span === 'fromBeginning' && (
                    <Message
                        warning
                        header='Enormous loading time warning'
                        content='It may take a lot of time to load all the data. Please, be patient :)'
                    />
                )}
                <Loader active />
            </>
        );
    } else if (timeSpanReport.status === 'error') {
        return <Message error>{timeSpanReport.error?.message}</Message>;
    } else {
        return null;
    }
};