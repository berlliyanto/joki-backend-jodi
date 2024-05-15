import { Request, Response } from "express";
import { ResponseInterface } from "../interface/response_interface";
import { paginationQuery } from "../utils/pagination_query";
import TestingService from "../services/testing_services";

class TestingController {
  async index(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { page, limit } = paginationQuery(req.query);
    const data = await new TestingService().index({ page, limit });
    if (!data.success) {
      return res.status(404).send(data);
    }
    return res.status(200).send(data);
  }

  async latest(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const data = await new TestingService().latest();
    if (!data.success) {
      return res.status(404).send(data);
    }
    return res.status(200).send(data);
  }
}

export default TestingController;
