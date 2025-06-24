import { Router } from 'express';
import { RegexPatterns } from '../lib/regex';
import { DBHelper } from '../engine/dbHelper';
import { deriveUserSecret } from '../lib/deriveUserSecret';
import { GRes } from '../lib/res';
import { JWTHelper } from '../engine/jwtHelper';
import { GroqEngine } from '../engine/groq';

export const apiRouter = Router();

apiRouter.post("/register", async (req, res) => {
    const bd = req.body;
    const valid = ((!!bd.id) && RegexPatterns.deviceId.test(bd.id)) && (
        !!bd.token ? (RegexPatterns.pushToken.test(bd.token)) : true
    );
    if (valid) {
        const registered = await DBHelper.register(bd.id, bd.token || undefined);
        if (registered) {
            const secret = deriveUserSecret(bd.id);
            const token = await JWTHelper.signJWT(bd.id, secret);
            if (token) {
                res.json(GRes.succ(token, { tr: false }));
            }
            else {
                res.status(500).json(GRes.err("API.SERVER_ERROR", { tr: true }));
            }
        }
        else {
            res.status(500).json(GRes.err("API.SERVER_ERROR", { tr: true }));
        }
    }
    else {
        res.status(400).json(GRes.err("API.WRONG_REQUEST", { tr: true }));
    }
});

// Verification middleware
apiRouter.use(async (req, res, next) => {
    const token = ((req.headers.authorization || "").split(" ")[1] || "");
    const verified = await JWTHelper.verifyJWT(token);
    if (verified) {
        next();
    }
    else {
        res.status(401).json(GRes.err("API.ACCESS_DENIED", { tr: true }));
    }
});

// ALL ROUTES BELOW ARE PROTECTED... ONLY AUTHROIZED REQUESTS CAN GO THROUGH

