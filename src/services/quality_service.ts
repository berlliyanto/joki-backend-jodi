import { PaginationInterface } from "../interface/pagination_interface";
import { ResponseInterface } from "../interface/response_interface";
import { Quality } from "../models/quality_model";

class QualityService {
  async index(
    machine: string,
    { page, limit }: PaginationInterface
  ): Promise<ResponseInterface> {
    const data = await Quality.paginate(
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
    const data = await Quality.findOne({ machine: machine }, null, {
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

  async defect(id: string, defect: number): Promise<ResponseInterface> {
    const quality = await Quality.findById(id);

    if (!quality) {
      return {
        success: false,
        message: "Data quality not found",
        data: null,
      };
    }

    if (quality?.good == 0) {
      return {
        success: false,
        message: "No product processed",
        data: null,
      };
    }

    if (defect > quality?.good) {
      return {
        success: false,
        message: "Defect cannot be greater than good",
        data: null,
      };
    }

    const data = await Quality.findOneAndUpdate(
      { _id: id },
      {
        $inc: {
          defect: defect,
          good: -defect,
        },
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
      message: "Data successfully updated",
      data: data,
    };
  }
}

export default QualityService;
