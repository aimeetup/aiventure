const expect = require('chai').expect;
const jwt = require('jsonwebtoken');

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
        jwt.verify = function () { // overwriting the verify method
            return { userId: 'abc' }
        };
        authMiddleware(req, {}, () => { });     // middleware will run with the overwritten verify
        expect(req).to.have.property('userId');
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

