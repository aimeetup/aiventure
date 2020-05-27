const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422; // Validation error
        error.data = errors.array();    // to keep the errors from validation to address through errProcessor
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;


};