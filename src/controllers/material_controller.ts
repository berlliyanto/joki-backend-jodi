import { Request, Response } from "express";
import { ResponseInterface } from "../interface/response_interface";
import MaterialService from "../services/material_services";
import { PaginationInterface } from "../interface/pagination_interface";
import { paginationQuery } from "../utils/pagination_query";

class MaterialController {
  async index(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { page, limit } = paginationQuery(req.query);
    const { machine } = req.params;
    const data = await new MaterialService().index(machine, { page, limit });

    if (!data.success) {
      return res.status(404).send(data);
    }

    return res.status(200).send(data);
  }

  async latest(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { machine } = req.params;
    const data = await new MaterialService().latest(machine);
    if (!data.success) {
      return res.status(404).send(data);
    }

    return res.status(200).send(data);
  }

  async update(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { machine, method } = req.params;
    const { value, type } = req.body;

    const data = await new MaterialService().update(machine, {
      method,
      type,
      value: Number(value),
    });

    if (!data.success) {
      return res.status(400).send(data);
    }

    return res.status(200).send(data);
  }
}

export default MaterialController;
