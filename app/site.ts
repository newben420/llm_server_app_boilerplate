import Constants from 'expo-constants';
let ENV = (Constants.expoConfig?.extra as any);
const production: boolean = ENV.PRODUCTION ?? false;
ENV = (production ? ENV.PROD : ENV.DEV) || {}

export class Site {
    static PRODUCTION: boolean = production;
    static DB_NAME: string = ENV.DB_NAME || "db.db";
    static SPLASH_TIME_MS: number = parseInt(ENV.SPLASH_TIME_MS) || 0;
    static BRAND: string = ENV.BRAND || "";
    static VERSION: string = Constants.expoConfig?.version || ENV.VERSION || "";
    static PAGE_REFRESH_INTERVAL_MS: number = parseInt(ENV.PAGE_REFRESH_INTERVAL_MS) || 15000;
    static BORDER_RADIUS: number = parseInt(ENV.BORDER_RADIUS) || 15;
    static TRANSITION_MS: number = parseInt(ENV.TRANSITION_MS) || 300;
    static APP_URL: string = ENV.APP_URL || "";
    static DEVELOPER: string = ENV.DEVELOPER || "";
    static RELEASE_YEAR: number = parseInt(ENV.RELEASE_YEAR || "0") || (new Date()).getFullYear();
    static API_BASE: string = ENV.API_BASE || "";
    static API_TIMEOUT_MS: number = parseInt(ENV.API_TIMEOUT_MS || "0") || 30000;
}