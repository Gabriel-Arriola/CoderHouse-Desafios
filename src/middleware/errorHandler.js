import { ERROR_TYPES } from "../utils/errorTypes.js";

export const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.name === 'CastError') {
        return res.status(400).json({ 
            error: `The id provided for ${err.path} is invalid. It must be a 24 character string.`,
            code: 400
        });
    }


    if (err.code && err.message) {
        return res.status(err.code).json({ error: err.message });
    }

    res.status(500).json({ error: ERROR_TYPES.INTERNAL_SERVER_ERROR.message });
};
