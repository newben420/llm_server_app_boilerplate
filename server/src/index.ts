import https from 'https';
import { Site } from './site';
if(Site.FORCE_FAMILY_4){
    https.globalAgent.options.family = 4;
}
import express, {Request, Response, NextFunction } from 'express';
import { startEngine, stopEngine } from './engine/terminal';
import http from 'http';
import bodyParser from 'body-parser';
import { Log } from './lib/log';
import { apiRouter } from './api/api';
import { GroqEngine } from './engine/groq';

const app = express();
const server = http.createServer(app);

app.disable("x-powered-by");
app.disable('etag');
app.use(bodyParser.json({ limit: "35mb" }));

app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: "35mb",
        parameterLimit: 50000,
    })
);

// app.get("/", (req, res) => {
//     GroqEngine.request({
//         messages: [
//             {role: "system", content: 'You are a helpful assistant named Maggie. always sign your messages at the end with your name.'},
//             {role: 'user', content:[
//                 {
//                     type: "text",
//                     text: "what is on the image?"
//                 },
//                 {
//                     type: "image_url",
//                     image_url: {url: "https://hips.hearstapps.com/hmg-prod/images/gettyimages-2194420718-67d9b4e326598.jpg?crop=0.646xw:0.969xh;0.148xw,0&resize=640:*"},
//                 }
//             ]},
//         ],
//         callback(r) {
//             res.json(r);
//         },
//         preferredModels: ["meta-llama/llama-4-scout-17b-16e-instruct", "meta-llama/llama-4-maverick-17b-128e-instruct"]
//     });
// });

app.use("/api", apiRouter);

app.use((req, res, next) => {
    res.sendStatus(404);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    Log.dev(err);
    res.sendStatus(500);
});

process.on('exit', async (code) => {
    // NOTHING FOR NOW
});

process.on('SIGINT', async () => {
    Log.dev('Process > Received SIGINT.');
    const l = await stopEngine();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    Log.dev('Process > Received SIGTERM.');
    const l = await stopEngine();
    process.exit(0);
});

process.on('uncaughtException', async (err) => {
    Log.dev('Process > Unhandled exception caught.');
    console.log(err);
    if (Site.EXIT_ON_UNCAUGHT_EXCEPTION) {
        const l = await stopEngine();
        process.exit(0);
    }
});

process.on('unhandledRejection', async (err, promise) => {
    Log.dev('Process > Unhandled rejection caught.');
    console.log("Promise:", promise);
    console.log("Reason:", err);
    if (Site.EXIT_ON_UNHANDLED_REJECTION) {
        const l = await stopEngine();
        process.exit(0);
    }
});


startEngine().then(r => {
    if(r){
        app.listen(Site.PORT, () => {
            console.log(`Server running at http://localhost:${Site.PORT}`);
        });
    }
    else{
        console.log("Failed to initialize engines.");
    }
});