import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

export const validateTroubleshoot = [
  check("machine").isString(),
  check("name").isString(),
  check("problem").isString(),
  check("state").isBoolean(),
  check("date").isDate(),
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
