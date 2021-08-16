import * as React from "react";

import { Container, Divider, Header } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from "../hooks";
import { useServices } from "../services";
import { getStatesReportByDate } from "../store";

export const App: React.FC = () => {
    const { covidReportService } = useServices();
    const statesReportByDate = useAppSelector(s => s.statesReportByDate);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(
            getStatesReportByDate(
                covidReportService.getStatesReportByDate('2021-07-15')
            )
        );
    }, []);

    return (
        <>
            <Container style={{ marginTop: 40 }}>
                <Header textAlign="center" as='h1'>
                    COVID 🦠 STATS 📈 FOR USA 🇺🇸
                </Header>
                <Divider />

                Data available since 22 Jan 2020

                <pre>
                    {JSON.stringify(statesReportByDate, null, 4)}
                </pre>
            </Container>
            <br />
        </>
    );
};
