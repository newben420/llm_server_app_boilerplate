import { deriveUserSecret } from "../lib/deriveUserSecret";
import { Log } from "../lib/log";
import { Site } from "../site";
import { decode, sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken'

export class JWTHelper {
    static signToken = (payload: any, userSecret: string) => {
        return new Promise<string | null>((resolve, reject) => {
            let options: SignOptions = {
                algorithm: 'HS256',
                issuer: Site.JWT_ISSUER,
                expiresIn: Math.ceil(Site.JWT_DURATION_MS / 1000),
            };
            sign(payload, userSecret, options, (err, token) => {
                if (err || !token) {
                    Log.dev(err || (new Error('JWT - Could not sign token.')));
                    resolve(null);
                }
                else {
                    resolve(token as string);
                }
            });
        });
    }

    static signJWT = (id: string, secret: string) => {
        return new Promise<string | null>(async (resolve, reject) => {
            let payload: any = {};
            payload.sub = id;
            payload.iat = Math.ceil(Date.now() / 1000);
            resolve(await JWTHelper.signToken(payload, secret));
        });
    }

    static verifyJWT = (token: string) => {
        return new Promise<boolean>((resolve, reject) => {
            const decoded = decode(token) as { sub: string } | null;
            if (!decoded || !decoded.sub) {
                resolve(false);
            }
            else {
                const secret = deriveUserSecret(decoded.sub);
                let options: VerifyOptions = {
                    algorithms: ["HS256"],
                    issuer: Site.JWT_ISSUER,
                    ignoreExpiration: false,
                    subject: decoded.sub,
                    clockTolerance: 120,
                    maxAge: `${Site.JWT_DURATION_MS}ms`,
                    clockTimestamp: Math.ceil(Date.now() / 1000),
                };

                verify(token, secret, options, (error, payload) => {
                    if(error){
                        Log.dev(error);
                        resolve(false);
                    }
                    else{
                        resolve(payload ? true : false);
                    }
                });
            }
        })
    }
}