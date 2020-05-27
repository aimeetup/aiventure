const User = require('../models/user');

exports.signup = (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;


};