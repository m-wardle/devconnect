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
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const User_1 = __importDefault(require("../../models/User"));
const router = express.Router();
router.get("/", auth_1.default, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id).select("-password");
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
router.post("/", [
    express_validator_1.check("email", "Please include a valid email").isEmail(),
    express_validator_1.check("password", "Password is Required").exists(),
], async (req, res) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Invalid credentials" }] });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Invalid credentials" }] });
        }
        const payload = {
            user: {
                id: user.id,
            },
        };
        jsonwebtoken_1.default.sign(payload, config_1.default.get("jwtSecret"), { expiresIn: 360000 }, (err, token) => {
            if (err)
                throw err;
            res.json({ token });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error.");
    }
});
module.exports = router;
