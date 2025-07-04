import { config } from "dotenv";
const args = process.argv.slice(2);
config({
    path: args[0] || ".env",
})

export class Site {
    static ROOT: string = process.cwd() || __dirname;
    static PORT: number = parseInt(process.env["PORT"] || "0") || 3000;
    static PRODUCTION = (process.env["PRODUCTION"] || "").toLowerCase() == "true";
    static FORCE_FAMILY_4 = (process.env["FORCE_FAMILY_4"] || "").toLowerCase() == "true";
    static EXIT_ON_UNCAUGHT_EXCEPTION = (process.env["EXIT_ON_UNCAUGHT_EXCEPTION"] || "").toLowerCase() == "true";
    static EXIT_ON_UNHANDLED_REJECTION = (process.env["EXIT_ON_UNHANDLED_REJECTION"] || "").toLowerCase() == "true";

    static DB_HOST: string = (process.env[`DB_HOST_${Site.PRODUCTION ? 'PROD' : 'DEV'}`]) || "";
    static DB_USER: string = (process.env[`DB_USER_${Site.PRODUCTION ? 'PROD' : 'DEV'}`]) || "";
    static DB_PASS: string = (process.env[`DB_PASS_${Site.PRODUCTION ? 'PROD' : 'DEV'}`]) || "";
    static DB_SCHEMA: string = (process.env[`DB_SCHEMA_${Site.PRODUCTION ? 'PROD' : 'DEV'}`]) || "";
    static DB_PORT: number = parseInt((process.env[`DB_PORT_${Site.PRODUCTION ? 'PROD' : 'DEV'}`]) || "0") || 0;

    static JWT_SERVER_SECRET: string = process.env["JWT_SERVER_SECRET"] || "3ed4mf3rnv8m9fwr";
    static JWT_DURATION_MS: number = parseInt(process.env["JWT_DURATION_MS"] || "0") || 86400000;
    static JWT_ISSUER: string = process.env["JWT_ISSUER"] || "app";

    static GROQ_KEY: string = process.env["GROQ_KEY"] || "";
    static GROQ_ENDPOINT: string = process.env["GROQ_ENDPOINT"] || "";
    static GROQ_MODELS: string[] = (process.env["GROQ_MODELS"] || "").split(" ").filter(x => x.length > 0);
    static GROQ_REQUEST_TIMEOUT_MS: number = parseInt(process.env["GROQ_REQUEST_TIMEOUT_MS"] || "0") || Infinity;
    static GROQ_MAX_RETRIES: number = parseInt(process.env["GROQ_MAX_RETRIES"] || "0") || 1;
    static GROQ_HTTP_TIMEOUT_MS: number = parseInt(process.env["GROQ_HTTP_TIMEOUT_MS"] || "0") || 60000;
}