// Error handling middleware

const errorHandler = (err, req, res,next) => {

    "use strict";

    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.render("error-template", {
        error: {
            message: process.env.NODE_ENV === 'production' 
                ? "An error occurred. Please try again later."
                : err.message
        }
    });
};

module.exports = { errorHandler };
