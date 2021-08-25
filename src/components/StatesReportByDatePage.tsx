import dayjs from 'dayjs';
import * as React from 'react';
import { Button, Icon, Loader, Message, Table } from 'semantic-ui-react';

import { useAppDispatch, useAppSelector } from "../hooks";
import { useServices } from "../services";
import { getStatesReportByDate } from "../store";

export const StatesReportByDatePage: React.FC<{
    urlParams: {
        date: string | undefined,
    },
    onInvalidUrlParams: (params: { date: string }) => void,
    onBackClick: () => void,
}> = ({
    urlParams,
    onInvalidUrlParams,
    onBackClick
}) => {
        const { covidReportService, dateHelper } = useServices();
        const { data, status, error } = useAppSelector(s => s.statesReportByDate);
        const dispatch = useAppDispatch();
        const sortedData = React.useMemo(
            () => data ? [...data].sort((a, b) => b.deaths - a.deaths) : [],
            [data]
        );

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
                <BackButton onClick={onBackClick} />
                <br />
                <br />
                Report for date: {dayjs(urlParams.date).format('DD MMM YYYY')}

                {(() => {
                    if (status === 'success') {
                        return (
                            <>
                                <Table striped>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>State</Table.HeaderCell>
                                            <Table.HeaderCell>Deaths</Table.HeaderCell>
                                            <Table.HeaderCell>Confirmed</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body>
                                        {sortedData.map(x => (
                                            <Table.Row key={x.name}>
                                                <Table.Cell><strong>{x.name}</strong></Table.Cell>
                                                <Table.Cell>{x.deaths}</Table.Cell>
                                                <Table.Cell>{x.confirmed}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>

                                <BackButton onClick={onBackClick} />
                            </>
                        );
                    } else if (status === 'loading') {
                        return <Loader active />
                    } else if (status === 'error') {
                        return <Message error>{error?.message}</Message>;
                    } else {
                        return null;
                    }
                })()}
            </>
        );
    };

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <Button
        icon
        labelPosition='left'
        onClick={onClick}
    >
        <Icon name='arrow left' />
        Back
    </Button>
);