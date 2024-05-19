import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

export const onlyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const decoded: JwtPayload = jwtDecode(token);
  if (decoded.role !== "admin") {
    return res.status(401).send({ message: "You are not admin" });
  }
  next();
};
