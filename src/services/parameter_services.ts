import mongoose from "mongoose";
import { PaginationInterface } from "../interface/pagination_interface";
import { ParameterType } from "../interface/parameter_interface";
import { ResponseInterface } from "../interface/response_interface";
import { Parameter } from "../models/parameter_model";
import { OEE } from "../models/oee_model";
import { Availability } from "../models/availability_model";
import { Quality } from "../models/quality_model";
import { Performance } from "../models/performance_model";

class ParameterServices {
  async index(
    machine: string,
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
  async latest(machine: string): Promise<ResponseInterface> {
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

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Performance.create({machine, operation_time: 0, processed: 0, cycle_time: 0, state: true,});
      await Quality.create({machine, processed: 0, good: 0, defect: 0, state: true,});
      await Availability.create({machine, operation_time: 0, down_time: 0, running_time: 0, state: true,})
      await OEE.create({machine, availability: 0, quality: 0, performance: 0, state: true,});
      await Parameter.create({machine, loading_time, cycle_time, oee_target, object_type, state: true,});

      await session.commitTransaction();
      return {
        success: true,
        message: "Data saved",
        data: data,
      };
    } catch (error) {
      await session.abortTransaction();
      return {
        success: false,
        message: "Error while saving data : " + error,
        data: null,
      };
    }
  }

  async reset(machine: string): Promise<ResponseInterface> {
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
