import { PaginationInterface } from "../interface/pagination_interface";
import { ParameterType } from "../interface/parameter_interface";
import { ResponseInterface } from "../interface/response_interface";
import { Parameter } from "../models/parameter_model";

class ParameterServices {
  async index(
    machine: number,
    { page, limit }: PaginationInterface
  ): Promise<ResponseInterface> {
    const data = await Parameter.paginate(
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
  async latest(machine: number): Promise<ResponseInterface> {
    const data = await Parameter.findOne({ machine: machine }, null, {
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
  async new(data: ParameterType): Promise<ResponseInterface> {
    const { machine, loading_time, cycle_time, oee_target, object_type } = data;
    if (
      !machine ||
      !loading_time ||
      !cycle_time ||
      !oee_target ||
      !object_type
    ) {
      return {
        success: false,
        message:
          "machine, loading_time, cycle_time, oee_target and object_type is required",
        data: null,
      };
    }

    const parameter = new Parameter({
      machine,
      loading_time,
      cycle_time,
      oee_target,
      object_type,
      state: true,
    });
    await parameter.save();
    return {
      success: true,
      message: "Data saved",
      data: parameter,
    };
  }

  async reset(machine: number): Promise<ResponseInterface> {
    const data = await Parameter.updateMany(
      { machine: machine, state: true },
      { state: false }
    );

    if (data.modifiedCount < 1) {
      return {
        success: false,
        message: "Data not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "Data reset",
      data: data,
    };
  }
}

export default ParameterServices;
