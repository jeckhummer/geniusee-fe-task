import * as React from "react";

import { Container, Divider, Header } from 'semantic-ui-react';
import { useServices } from "../services";

export const App: React.FC = () => {
    const { covidReportService } = useServices();

    React.useEffect(() => {
        covidReportService.getStatesReportByDate('2021-07-15')
            // covidReportService.getTimeSpanReport({ period: 'from_beginning_by_month', date: dayjs('2021-07-15') })
            .then(x => console.log(x));
    }, []);

    return (
        <>
            <Container style={{ marginTop: 40 }}>
                <Header textAlign="center" as='h1'>
                    COVID 🦠 STATS 📈 FOR USA 🇺🇸
                </Header>
                <Divider />

                Data available since 22 Jan 2020
            </Container>
            <br />
        </>
    );
};
