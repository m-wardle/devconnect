"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express = __importStar(require("express"));
const gravatar_1 = __importDefault(require("gravatar"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const User_1 = require("../../models/User");
const router = express.Router();
router.post("/", [
    express_validator_1.check("name", "Name is required").not().isEmpty(),
    express_validator_1.check("email", "Please include a valid email").isEmail(),
    express_validator_1.check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
], async (req, res) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
        const userCheck = await User_1.User.findOne({ email });
        if (userCheck) {
            res.status(400).json({ errors: [{ msg: "User already exists" }] });
        }
        const avatar = gravatar_1.default.url(email, {
            s: "200",
            r: "pg",
            d: "mm",
        });
        const user = new User_1.User({
            name,
            email,
            avatar,
            password,
        });
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(password, salt);
        await user.save();
        res.send("User registered");
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error.");
    }
});
module.exports = router;
