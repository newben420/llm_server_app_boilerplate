import { dbSetUp } from './db';
import axios from 'axios';
import { getToken, storeToken } from './token';
import { Site } from '../site';
import { refreshTokenWithExpoId } from './auth';
import { Log } from './log';
import { i18n } from './i18n';

const DEFAULT_ERROR = ""

const api = axios.create({
    baseURL: Site.API_BASE,
    timeout: Site.API_TIMEOUT_MS,
});

api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (token) prom.resolve(token);
        else prom.reject(error);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },
                        reject: (err: any) => reject(err),
                    });
                });
            }

            isRefreshing = true;

            try {
                const newToken = await refreshTokenWithExpoId();
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

class Res {
    succ: boolean;
    message: any;

    constructor(succ: boolean, message: any = "") {
        this.succ = succ;
        this.message = message;
    }
}

export const GET = (path: string) => new Promise<Res>((resolve, reject) => {
    api.get(path).then(r => {
        if (r.status == 200) {
            if (r.data.succ) {
                // success
                resolve(new Res(true, r.data.extra?.tr ? i18n.t(r.data.message, r.data.extra) : r.data.message));
            }
            else {
                // error
                if (r.data.message) {
                    resolve(new Res(false, r.data.extra?.tr ? i18n.t(r.data.message, r.data.extra) : r.data.message));
                }
                else {
                    resolve(new Res(false, i18n.t("API.UNKNOWN_RESPONSE")));
                }
            }
        }
        else {
            resolve(new Res(false, i18n.t('SERVER_STATUS', { status: r.status })));
        }
    }).catch(error => {
        if (error.response && error.response.data && (error.response.data.message || error.response.data.message == "")) {
            resolve(new Res(false, error.response.data.extra?.tr ? i18n.t(error.response.data.message, error.response.data.extra) : error.response.data.message));
        }
        else {
            resolve(new Res(false, i18n.t("API.DEFAULT_ERROR")));
        }
    });
});

export const POST = (path: string, body: any) => new Promise<Res>((resolve, reject) => {
    api.post(path, body).then(r => {
        if (r.status == 200) {
            if (r.data.succ) {
                // success
                resolve(new Res(true, r.data.extra?.tr ? i18n.t(r.data.message, r.data.extra) : r.data.message));
            }
            else {
                // error
                if (r.data.message) {
                    resolve(new Res(false, r.data.extra?.tr ? i18n.t(r.data.message, r.data.extra) : r.data.message));
                }
                else {
                    resolve(new Res(false, i18n.t("API.UNKNOWN_RESPONSE")));
                }
            }
        }
        else {
            resolve(new Res(false, i18n.t('SERVER_STATUS', { status: r.status })));
        }
    }).catch(error => {
        if (error.response && error.response.data && (error.response.data.message || error.response.data.message == "")) {
            resolve(new Res(false, error.response.data.extra?.tr ? i18n.t(error.response.data.message, error.response.data.extra) : error.response.data.message));
        }
        else {
            resolve(new Res(false, i18n.t("API.DEFAULT_ERROR")));
        }
    });
});
