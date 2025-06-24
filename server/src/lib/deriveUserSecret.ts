import { createHmac } from "crypto"
import { Site } from "../site"

export const deriveUserSecret = (id: string) => {
    return createHmac('sha256', Site.JWT_SERVER_SECRET).update(id).digest('hex');
}