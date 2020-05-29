const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

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
    })
});
