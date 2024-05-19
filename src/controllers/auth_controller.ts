import { Request, Response } from "express";
import { ResponseInterface } from "../interface/response_interface";
import AuthServices from "../services/auth_services";

class AuthController {
  async login(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { username, password } = req.body;
    const data = await new AuthServices().login({ username, password });
    if (!data.success) {
      return res.status(401).send(data);
    }

    return res.status(200).send(data);
  }

  async register(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { username, password, name, role } = req.body;

    const data = await new AuthServices().register({
      username,
      password,
      name,
      role,
    });
    if (!data.success) {
      return res.status(401).send(data);
    }

    return res.status(200).send(data);
  }

  async logout(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    return res.status(200).send({
      success: true,
      message: "Logout Success",
      data: null,
    });
  }
}

export default AuthController;
