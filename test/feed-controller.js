const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/post');
const FeedController = require('../controllers/feed');

// const MONGODB_URI =
//     `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-n7ze3.mongodb.net/${process.env.MONGO_TEST_DATABASE}`;


describe('Feed Controller', function () {

    before(function (done) {    // before hook - initialization script - executes once before all test cases
        mongoose
            .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(result => {
                // const server = app.listen(process.env.PORT || 8080);   
                const user = new User({
                    email: 'test@test.com',
                    password: 'tester',
                    name: 'Test',
                    posts: [],
                    _id: '5c0f66b979af55031b34728a'
                });
                return user.save();
            })
            .then(() => {
                done();
            })
    })

    beforeEach(function () { })  // setup Hook for scripts needed before each test

    afterEach(function () { })    // cleanup Hook for scripts needed before each test

    it('should add a created post to the posts of the creator', function (done) {
        // sinon.stub(User, 'findOne');    // blank stub / mocking(overwriting) the findOne db method for User model
        // User.findOne.throws();

        const req = {
            body: {
                title: 'Test Post',
                content: 'A Test Post'
            },
            file: {
                path: 'abc'
            },
            userId: '5c0f66b979af55031b34728a'
        };

        AuthController.login(req, {}, () => { }).then(result => {
            // console.log(result);
            expect(result).to.be.an('error');   // Chai able to detect the data type including error
            expect(result).to.have.property('statusCode', 500);
            done();
        });
    });

    after(function (done) {     // after hook - cleanup script
        User.deleteMany({})
            .then(() => {  // delete all users to have a blank db for next tests & to avoid duplicate user error
                return mongoose.disconnect()
            })
            .then(() => {
                done();
            });
    });

});