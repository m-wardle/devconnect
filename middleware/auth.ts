import * as express from "express";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config";

export interface IToken {
  user: {
    id: string;
  };
}

export default function (req: Request, res: Response, next: NextFunction) {
  // Get token from header

  const token = req.header("x-auth-token");

  // Check if not token

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied." });
  }

  // Verify token

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = (decoded as IToken).user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}
