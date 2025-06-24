import { GroqEngine } from "./groq";

export const startEngine = () => new Promise<boolean>(async (resolve, reject) => {
    const loaded = true
    resolve(loaded);
});

export const stopEngine = () => new Promise<boolean>(async (resolve, reject) => {
    const ended = (await GroqEngine.shutdown());
    resolve(ended);
});