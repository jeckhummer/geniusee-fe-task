import dayjs from 'dayjs';
import * as React from 'react';

import { useAppDispatch, useAppSelector } from "../hooks";
import { useServices } from "../services";
import { getStatesReportByDate } from "../store";

export const StatesReportByDatePage: React.FC<{
    urlParams: {
        date: string | undefined,
    };
    onInvalidUrlParams: (params: { date: string }) => void,
}> = ({ urlParams, onInvalidUrlParams }) => {
    const { covidReportService, dateHelper } = useServices();
    const statesReportByDate = useAppSelector(s => s.statesReportByDate);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        const now = dayjs();
        const date = dayjs(urlParams.date);
        const minDate = covidReportService.getEarliestAvailableReportDate();

        // url params sanitization
        const dateParam = dateHelper.stringifyDateForUrl(
            date.isValid()
                && minDate.isBefore(date)
                && date.isBefore(now)
                ? date
                : now
        );

        // if there is something wrong with url params
        if (dateParam !== urlParams.date) {
            onInvalidUrlParams({ date: dateParam });
        } else {
            dispatch(
                getStatesReportByDate(
                    covidReportService.getStatesReportByDate(date)
                )
            );
        }
    }, [urlParams]);

    return (
        <>
            <pre>
                {JSON.stringify(statesReportByDate, null, 4)}
            </pre>
        </>
    );
};