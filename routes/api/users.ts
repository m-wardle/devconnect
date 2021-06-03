import * as express from "express";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import { check, validationResult } from "express-validator";
import { User, IUser } from "../../models/User";
const router = express.Router();

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists

      const userCheck = await User.findOne({ email });

      if (userCheck) {
        res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }

      // Get users gravatar

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      const user: IUser = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      // Register user

      await user.save();

      // Return jsonwebtoken

      res.send("User registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error.");
    }
  }
);

export = router;
