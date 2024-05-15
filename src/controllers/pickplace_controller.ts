import { Request, Response } from "express";
import { ResponseInterface } from "../interface/response_interface";
import { paginationQuery } from "../utils/pagination_query";
import PickPlaceService from "../services/pickplace_services";

class PickPlaceController {
  async index(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { page, limit } = paginationQuery(req.query);
    console.log(limit);
    const data = await new PickPlaceService().index({ page, limit });
    if (!data.success) {
      return res.status(404).send(data);
    }
    return res.status(200).send(data);
  }

  async latest(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const data = await new PickPlaceService().latest();
    if (!data.success) {
      return res.status(404).send(data);
    }
    return res.status(200).send(data);
  }
}

export default PickPlaceController;
