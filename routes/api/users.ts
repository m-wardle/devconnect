import * as express from "express";
const router = express.Router();

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get("/", (req, res) => res.send("Users route"));

export = router;
