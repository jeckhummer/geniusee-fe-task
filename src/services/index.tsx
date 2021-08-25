import * as React from "react";

import { AxiosService } from "./axiosService";
import { CovidApiClient } from "./covidApiClient";
import { CovidReportService } from "./covidReportService";
import { DateHelper } from "./dateHelper";
import { ICovidReportService, IDateHelper } from "./models";

export interface IServices {
    covidReportService: ICovidReportService;
    dateHelper: IDateHelper;
}

export const ServiceContext = React.createContext<IServices>(null as any);

export const buildServices = (): IServices => {
    const axiosService = new AxiosService();
    const axiosInstance = axiosService.getInstance();
    const covidApiClient = new CovidApiClient(axiosInstance);
    const dateHelper = new DateHelper();
    const covidReportService = new CovidReportService(covidApiClient, dateHelper);

    return {
        covidReportService,
        dateHelper
    };
};

export const ServiceProvider: React.FC<{
    services: IServices;
}> = ({ children, services }) => (
    <ServiceContext.Provider value={services}>
        {children}
    </ServiceContext.Provider>
);

export function useServices() {
    return React.useContext(ServiceContext);
}
