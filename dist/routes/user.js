"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../controller/user"));
const userController = new user_1.default();
const route = (0, express_1.Router)();
route.post('/', async (req, res) => {
    userController.createUser(req, res);
});
route.get('/login', async (req, res) => {
    userController.userLogin(req, res);
});
module.exports = route;
//# sourceMappingURL=user.js.map