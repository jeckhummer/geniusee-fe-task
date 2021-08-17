import QueryString from "qs";
import * as React from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";

import { Layout } from "./Layout";
import { StatesReportByDatePage } from "./StatesReportByDatePage";
import { TimeSpanReportPage } from "./TimeSpanReportPage";

export const App: React.FC = () => {
    const history = useHistory();

    return (
        <Layout>
            <Switch>
                <Route path="/" exact render={({ location: { search } }) => {
                    const qs = QueryString.parse(search, { ignoreQueryPrefix: true });
                    const params = {
                        span: qs['span'] as string | undefined,
                        month: qs['month'] as string | undefined,
                    };
                    const redirectWithValidParams = (params: { span: string, month: string | undefined }) => {
                        const qs = QueryString.stringify(params, { addQueryPrefix: true });
                        history.replace('/' + qs);
                    }

                    return (
                        <TimeSpanReportPage
                            onInvalidUrlParams={redirectWithValidParams}
                            urlParams={params}
                        />
                    );
                }} />

                <Route path="/states" exact render={({ location: { search } }) => {
                    const qs = QueryString.parse(search, { ignoreQueryPrefix: true });
                    const params = {
                        date: qs['date'] as string | undefined,
                    };
                    const redirectWithValidParams = (params: { date: string }) => {
                        const qs = QueryString.stringify(params, { addQueryPrefix: true });
                        history.replace('/states' + qs);
                    }

                    return (
                        <StatesReportByDatePage
                            onInvalidUrlParams={redirectWithValidParams}
                            urlParams={params}
                        />
                    );
                }} />

                <Redirect to="/" />
            </Switch>
        </Layout>
    );
};
