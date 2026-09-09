// Error handling middleware

const sanitizeForLog = (input) => {
    if (input == null) {
        return '';
    }
    return String(input)
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
};

const errorHandler = (err, req, res,next) => {

    "use strict";

    console.error(sanitizeForLog(err.message));
    console.error(sanitizeForLog(err.stack));
    res.status(500);
    res.render("error-template", {
        error: err
    });
};

module.exports = { errorHandler };
