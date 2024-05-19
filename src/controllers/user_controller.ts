import { Request, Response } from "express";
import { ResponseInterface } from "../interface/response_interface";
import { paginationQuery } from "../utils/pagination_query";
import UserService from "../services/user_services";

class UserController {
  async index(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { page, limit } = paginationQuery(req.query);
    const data = await new UserService().index({ page, limit });
    if (!data.success) {
      return res.status(404).send(data);
    }
    return res.status(200).send(data);
  }

  async update(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { id } = req.params;
    const data = await new UserService().update(id, req.body);
    if (!data.success) {
      return res.status(400).send(data);
    }
    return res.status(200).send(data);
  }

  async destroy(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { id } = req.params;
    const data = await new UserService().destroy(id);
    if (!data.success) {
      return res.status(400).send(data);
    }
    return res.status(200).send(data);
  }
}

export default UserController;