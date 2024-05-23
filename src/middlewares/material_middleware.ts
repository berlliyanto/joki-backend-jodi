import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

const validateUpdateMaterial = [
  check("type").isString(),
  check("value").isInt(),
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

export default validateUpdateMaterial;
