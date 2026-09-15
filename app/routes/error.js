// Error handling middleware

const errorHandler = (err, req, res,next) => {

    "use strict";

    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    const safeError = {
        message: String(err.message || 'An error occurred'),
        stack: process.env.NODE_ENV === 'production' ? undefined : String(err.stack || '')
    };
    res.render("error-template", {
        error: safeError
    });
};

module.exports = { errorHandler };
