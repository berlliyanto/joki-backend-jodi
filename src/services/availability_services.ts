import { PaginationInterface } from "../interface/pagination_interface";
import { ResponseInterface } from "../interface/response_interface";
import { Availability } from "../models/availability_model";

class AvailabilityService {
  async index(
    machine: string,
    { page, limit }: PaginationInterface
  ): Promise<ResponseInterface> {
    const data = await Availability.paginate(
      { machine: machine },
      { page: page, limit: limit, sort: { _id: -1 } }
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

  async latest(machine: string): Promise<ResponseInterface> {
    const data = await Availability.findOne({ machine: machine }, null, {
      sort: { _id: -1 },
    });
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

}

export default AvailabilityService;
