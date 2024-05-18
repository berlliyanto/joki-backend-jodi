import { PaginationInterface } from "../interface/pagination_interface";
import { ResponseInterface } from "../interface/response_interface";
import { TroubleshootInterface } from "../interface/troubleshoot_interface";
import Troubleshoot from "../models/troubleshoot_model";

class TroubleshootService {
  async index(
    machine: string,
    { page, limit }: PaginationInterface
  ): Promise<ResponseInterface> {
    const data = await Troubleshoot.paginate(
      {
        machine: machine,
      },
      {
        page: page,
        limit: limit,
        sort: { _id: -1 },
      }
    );

    if (!data) {
      return {
        success: false,
        message: "Data not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "Data found",
      data: data,
    };
  }

  async new(data: TroubleshootInterface): Promise<ResponseInterface> {
    const troubleshoot = new Troubleshoot(data);
    await troubleshoot.save();
    return {
      success: true,
      message: "Data saved",
      data: troubleshoot,
    };
  }

  async update(id: string, state: boolean): Promise<ResponseInterface> {
    const troubleshoot = await Troubleshoot.findOneAndUpdate(
      { _id: id },
      { state: state }
    );

    if(!troubleshoot) {
      return {
        success: false,
        message: "Data not found",
        data: null
      }
    }

    return {
      success: true,
      message: "Data updated",
      data: troubleshoot
    }
  }
}

export default TroubleshootService;
