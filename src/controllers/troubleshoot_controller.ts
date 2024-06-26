import { Request, Response } from "express";
import { ResponseInterface } from "../interface/response_interface";
import TroubleshootService from "../services/troubleshoot_services";
import { paginationQuery } from "../utils/pagination_query";

class TroubleshootController {
  async index(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { page, limit } = paginationQuery(req.query);
    const { machine } = req.params;
    const data = await new TroubleshootService().index(machine, {
      page,
      limit,
    });

    if (!data.success) {
      return res.status(404).send(data);
    }

    return res.status(200).send(data);
  }

  async new(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const troubleshoot = await new TroubleshootService().new(req.body);
    if (!troubleshoot.success) {
      return res.status(400).send(troubleshoot);
    }

    return res.status(200).send(troubleshoot);
  }

  async update(
    req: Request,
    res: Response
  ): Promise<Response<ResponseInterface, Record<string, any>>> {
    const { id } = req.params;
    const { state } = req.body;

    const troubleshoot = await new TroubleshootService().update(id, state);
    if (!troubleshoot.success) {
      return res.status(400).send(troubleshoot);
    }

    return res.status(200).send(troubleshoot);
  }
}

export default TroubleshootController;
