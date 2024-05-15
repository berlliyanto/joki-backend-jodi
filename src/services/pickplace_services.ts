import { PaginationInterface } from "../interface/pagination_interface";
import { ResponseInterface } from "../interface/response_interface";
import { PickPlace } from "../models/picknplace_model";

class PickPlaceService {
  async index({
    page,
    limit,
  }: PaginationInterface): Promise<ResponseInterface> {
    const data = await PickPlace.paginate(
      {},
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

  async latest(): Promise<ResponseInterface> {
    const data = await PickPlace.findOne({}, null, {
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

export default PickPlaceService;