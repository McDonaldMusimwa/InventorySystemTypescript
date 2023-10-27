"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWTTOKEN = process.env.JWTTOKEN;
const SerialObject = {
    serialize: (user, done) => {
        done(null, user.id);
    },
    deserialize: (user, done) => {
        try {
            const userr = user_1.default.findById(user.id);
            done(null, userr);
        }
        catch (error) {
            done(error);
        }
    }
};
class UserController {
    async createUser(req, res) {
        //#swagger.tags=['User']
        try {
            // Extract user information from the request body
            const hashedPassword = await bcrypt_1.default.hash(req.body.password, 10);
            const newUser = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashedPassword
            };
            // Validate the input (you can use a library like Joi for this)
            if (!newUser.lastname || !newUser.firstname || !newUser.password || !newUser.email) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }
            const User = new user_1.default.User(newUser); // Create a new user with the 'NewUser' model
            const createdUser = await User.save(); // Save the user to the database
            res.status(200).json({ message: "created successfully" });
            return { ...createdUser._doc, _id: createdUser.toString() };
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async userLogin(req, res) {
        //#swagger.tags=['User']
        try {
            const userPassword = req.body.password;
            const userEmail = req.body.email;
            if (!userPassword || !userEmail) {
                res.status(401).json({ message: 'Please provide relevant data.' });
            }
            const user = await user_1.default.findOne({ email: userEmail });
            const hashedPassword = user.password;
            if (!user) {
                res.status(500).json({ message: 'User not found' });
            }
            bcrypt_1.default.compare(userPassword, hashedPassword, (err, result) => {
                if (err || !result) {
                    res.status(401).json({ message: 'Authentication failed' });
                }
                else {
                    if (result) {
                        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email: user.email }, JWTTOKEN, { expiresIn: '1h' });
                        res.status(200).json(token);
                    }
                }
            });
        }
        catch {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
exports.default = UserController; // Export the 'UserController' class
//# sourceMappingURL=user.js.map