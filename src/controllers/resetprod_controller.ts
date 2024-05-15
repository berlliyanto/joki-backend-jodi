import { Request, Response } from "express";
import { ResponseInterface } from "../interface/response_interface";
import ResetProdService from "../services/resetprod_service";

class ResetProdController {
  async reset(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { machine } = req.params;

    const data = await new ResetProdService().resetAll(machine);
    if (!data.success) {
      return res.status(404).send(data);
    }
    return res.status(200).send(data);
  }
}

export default ResetProdController;
