import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

const validateParameter = [
  check("machine").isString(),
  check("loading_time").isInt(),
  check("cycle_time").isDecimal(),
  check("oee_target").isInt(),
  check("object_type").isString(),
  check("target_count").isInt(),
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

export default validateParameter;
