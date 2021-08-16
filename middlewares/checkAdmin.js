const { ACCESS_DENIED_ERR } = require("../errors");

module.exports = (req, res, next) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
        return next({ status: 401, message: ACCESS_DENIED_ERR });
    }

    if (currentUser.role === "ADMIN") {
        return next();
    }

    return next({ status: 401, message: ACCESS_DENIED_ERR });
}