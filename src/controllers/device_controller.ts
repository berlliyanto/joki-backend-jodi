import { Request, Response } from "express";
import { ResponseInterface } from "../interface/response_interface";
import DeviceServices from "../services/device_services";
import { paginationQuery } from "../utils/pagination_query";

class DeviceController {
  async input(req: Request, res: Response): Promise<Response<ResponseInterface, Record<string, any>>> {
    const data = await new DeviceServices().input(req.body);
    if (!data.success) {
      return res.status(404).send(data);
    }
    return res.status(200).send(data);
  }
}

export default DeviceController;
