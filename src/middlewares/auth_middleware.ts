import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction): any => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  let secretKey = process.env["JWT_SECRET_KEY"] || "secret";
  const token: string = req.headers.authorization.split(" ")[1];

  try {
    const credential: string | object = jwt.verify(token, secretKey);
    if (credential) {
      return next();
    }
    return res.status(401).send({ message: "Token Invalid" });
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized", error: error });
  }
};

export const validateLogin = [
  check("username").isString(),
  check("password").isString(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    next();
  },
];

export const validateRegister = [
  check("username").isString(),
  check("password").isString(),
  check("name").isString(),
  check("role").isString(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    next();
  }
];
