const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

describe('Auth middleware', function () {
    it('should throw an error if no authorization header is present', function () {
        const req = {   // Create test request object
            get: function () {
                return null;
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw(
            'Not authenticated.'
        );
    });

    it('should throw an error if the authorization header is only one string', function () {
        const req = {   // Create test request object
            get: function () {
                return 'xyz';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw();
    });

    it('should yield a userId after decoding the token', function () {
        const req = {   // Create test request object
            get: function () {
                return 'Bearer dabldbljrljznrvlr';
            }
        };
        sinon.stub(jwt, 'verify');  // sinon provides a blank verufy stub, and register its calls
        jwt.verify.returns({ userId: 'abc' }); // configure verify return
        authMiddleware(req, {}, () => { });     // middleware will run with the overwritten verify
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');  // to test also the value / 2nd arg
        expect(jwt.verify.called).to.be.true;   // test to ensure the verify method was called
        jwt.verify.restore();
    });

    it('should throw an error if the token cannot be verified', function () {
        const req = {   // Create test request object
            get: function () {
                return 'Bearer xyz';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw();
    });
});

