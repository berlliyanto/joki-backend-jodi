import { Request, Response } from "express";
import { ResponseInterface } from "../interface/response_interface";
import QualityService from "../services/quality_service";
import { paginationQuery } from "../utils/pagination_query";
import AvailabilityService from "../services/availability_services";

class AvailabilityController {
  async index(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { page, limit } = paginationQuery(req.query);
    const { machine } = req.params;
    const data = await new AvailabilityService().index(machine, { page, limit });
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
    const data = await new AvailabilityService().latest(machine);
    if (!data.success) {
      return res.status(404).send(data);
    }
    return res.status(200).send(data);
  }
}

export default AvailabilityController;
