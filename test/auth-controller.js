const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

const MONGODB_URI =
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-n7ze3.mongodb.net/${process.env.MONGO_TEST_DATABASE}`;

describe('Auth Controller - Login', function () {
    it('should throw an error with code 500 if accessing the database fails', function (done) {
        sinon.stub(User, 'findOne');    // blank stub / mocking the findOne db method for User model
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        };

        AuthController.login(req, {}, () => { }).then(result => {
            // console.log(result);
            expect(result).to.be.an('error');   // Chai able to detect the data type including error
            expect(result).to.have.property('statusCode', 500);
            done();
        });

        User.findOne.restore();
    });

    it('should send a response with a valid user status for an existing user', function (done) {
        mongoose
            .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(result => {
                // const server = app.listen(process.env.PORT || 8080);   
                const user = new User({
                    email: 'test@test.com',
                    password: 'tester',
                    name: 'Test',
                    posts: []
                });
                return user.save();
            })
            .then(() => {

            })
            .catch(err => {
                console.log(err);
            });
    })
});
