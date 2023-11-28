"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 401;
    }
}
exports.default = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new AuthenticationError('Not authenticated.');
        next(error);
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, 'somesupersecretsecret');
    }
    catch (err) {
        err.statusCode = 500;
        next(err);
    }
    if (!decodedToken) {
        const error = new AuthenticationError('Not authenticated.');
        next(error);
    }
    req.userId = decodedToken.userId;
    next();
};
//# sourceMappingURL=is-auth.js.map