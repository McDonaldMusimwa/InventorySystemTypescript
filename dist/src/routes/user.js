"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../controller/user"));
const userController = new user_1.default();
const router = (0, express_1.Router)();
router.post('/', (req, res) => {
    console.log('where here');
    userController.createUser(req, res);
});
router.get('/login', (req, res) => {
    userController.userLogin(req, res);
});
module.exports = router;
//# sourceMappingURL=user.js.map