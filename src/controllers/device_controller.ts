import { Request, Response } from "express";
import { ResponseInterface } from "../interface/response_interface";
import DeviceServices from "../services/device_services";

class DeviceController {
  async input(req: Request, res: Response): Promise<Response<ResponseInterface, Record<string, any>>> {
    const data = await new DeviceServices().input(req.body);
    if (!data.success) {
      return res.status(400).send(data);
    }
    return res.status(200).send(data);
  }

  async monitorProduction(req: Request, res: Response): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { machine } = req.params;
    const data = await new DeviceServices().monitorProduction(machine);
    if (!data.success) {
      return res.status(404).send(data);
    }

    return res.status(200).send(data);
  }
}

export default DeviceController;
