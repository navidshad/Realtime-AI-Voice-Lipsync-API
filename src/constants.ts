export const config = {
    sessionDataApiUrl: process.env.GET_SESSION_DATA_URL,
};

export const isLocalhost = window.location.href.includes('localhost');
export const APIKA_SERVICE_URL = process.env.APIKA_SERVICE_URL;

export type Config = {
    autoShow: boolean;
    devMode?: false;
}

export const defaultConfig = {
    autoShow: false,
    devMode: false,
}