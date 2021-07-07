import * as express from "express";
import auth from "../../middleware/auth";
import Profile from "../../models/Profile";
import User from "../../models/User";
const router = express.Router();

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/", auth, async (req: express.Request, res: express.Response) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export = router;
