import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";

export const validateUserUpdate = [
  check("name").isString(),
  check("username").isString(),
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
  },
];
