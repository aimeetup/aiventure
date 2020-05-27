const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {  // if no Authorization header (undefined)
        const error = new Error('Not authneticated.');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];   // Get the 2nd value after Bearer
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};