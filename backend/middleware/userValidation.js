import { jsonResponse } from "../utils/responseSchema.js";
import { userSchema } from "../validator/user.js";

export function userValidation(req, res, next) {
    const { success, error } = userSchema.safeParse(req.body);
    if(!success) {
        return res.json(jsonResponse(400, 'Bad Request', error, true));
    }
    next();
}