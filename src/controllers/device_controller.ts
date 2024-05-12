import { Request, Response } from "express";
import { ResponseInterface } from "../interface/response_interface";
import DeviceServices from "../services/device_services";
import { paginationQuery } from "../utils/pagination_query";

class DeviceController {
  async index(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { page, limit } = paginationQuery(req.query);

    const data = await new DeviceServices().index({ page, limit });
    if (!data.success) {
      return res.status(404).send(data);
    }
    return res.status(200).send(data);
  }

  async input(req: Request, res: Response): Promise<Response<ResponseInterface, Record<string, any>>> {
    const data = await new DeviceServices().input(req.body);
    if (!data.success) {
      return res.status(404).send(data);
    }
    return res.status(200).send(data);
  }

  async pbStatus(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const data = await new DeviceServices().pbStatus();
    if (!data.success) {
      return res.status(404).send(data);
    }
    return res.status(200).send(data);
  }

  async latestSensor(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const data = await new DeviceServices().latestSensor();
    if (!data.success) {
      return res.status(404).send(data);
    }
    return res.status(200).send(data);
  }

  async historySensor(req: Request, res: Response): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { page, limit } = paginationQuery(req.query);

    const data = await new DeviceServices().historySensor({ page, limit });
    if (!data.success) {
      return res.status(404).send(data);
    }
    return res.status(200).send(data);
  }
}

export default DeviceController;
