import { Request, Response } from "express";
import { ResponseInterface } from "../interface/response_interface";
import { paginationQuery } from "../utils/pagination_query";
import PerformanceService from "../services/performance_services";

class PerformanceController {
  async index(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { page, limit } = paginationQuery(req.query);
    const { machine } = req.params;
    const data = await new PerformanceService().index(machine, { page, limit });
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
    const data = await new PerformanceService().latest(machine);
    if (!data.success) {
      return res.status(404).send(data);
    }
    return res.status(200).send(data);
  }
}

export default PerformanceController;
