import axios, { AxiosInstance } from "axios";

import { IAxiosService } from "./models";

export class AxiosService implements IAxiosService {
    public getInstance(): AxiosInstance {
        const instance = axios.create();

        instance.interceptors.request.use(
            config => ({
                ...config,
                baseURL: "https://covid-api.com/api/",
            }),
            err => Promise.reject(err),
        );

        return instance;
    }
}
