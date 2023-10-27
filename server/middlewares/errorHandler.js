const errConstants = require("../constants/err")

const errHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    switch(statusCode) {
        case errConstants.VALIDATION_ERROR:
            res.json({
                title : "Validation Failed",
                message : err.message,
                stackTrace : err.stack
            });
            break;
        case errConstants.UNAUTHORIZED:
            res.json({
                title : "you do not have authorization to access !",
                message : err.message,
                stackTrace : err.stack
            });
            break;
        case errConstants.FORBIDDEN:
            res.json({
                title : "forbidden page!",
                message : err.message,
                stackTrace : err.stack
            });
            break;
        case errConstants.NOT_FOUND:
            res.json({
                title : "Not found !",
                message : err.message,
                stackTrace : err.stack
            });
            break;
        case errConstants.SERVER_ERROR:
            res.json({
                title : "server error !",
                message : err.message,
                stackTrace : err.stack
            });
            break;
        case errConstants.UNVERIFIED_TOKEN:
            res.json({
                title : "missing or unverified token!",
                message : err.message,
                stackTrace : err.stack
            });
        default:
            res.json({
                message : err.message,
                stackTrace : err.stack
            });
            break;
    }
}

module.exports = errHandler;