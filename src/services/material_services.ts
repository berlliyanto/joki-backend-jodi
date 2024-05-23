import mongoose, { Mongoose } from "mongoose";
import { ResponseInterface } from "../interface/response_interface";
import { Material } from "../models/material_model";
import { MaterialHistory } from "../models/materialhistory_model";
import { PaginationInterface } from "../interface/pagination_interface";

class MaterialService {
  async index(
    machine: string,
    { page, limit }: PaginationInterface
  ): Promise<ResponseInterface> {
    const data = await MaterialHistory.paginate(
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
    const data = await Material.find({ machine: machine }, null, {
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

  async update(
    machine: string,
    { method, type, value }: { method: string; type: string; value: number }
  ): Promise<ResponseInterface> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let data;
      if (method === "add") {
        data = await Material.findOneAndUpdate(
          { $and: [{ machine: machine }, { type: type }] },
          { $inc: { value: value } },
          { new: true }
        );

        await MaterialHistory.create({
          machine: machine,
          type: type,
          category: "In",
          value: value,
        });
      } else if (method === "min") {
        data = await Material.findOneAndUpdate(
          { $and: [{ machine: machine }, { type: type }] },
          { $inc: { value: -value } },
          { new: true }
        );

        await MaterialHistory.create({
          machine: machine,
          type: type,
          category: "Out",
          value: value,
        });
      } else {
        return {
          success: false,
          message: "Type not found",
          data: null,
        };
      }

      if (!data) {
        throw new Error("Data not found");
      }

      return {
        success: true,
        message: "Data Updated",
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error while updating data : " + error,
        data: null,
      };
    }
  }
}

export default MaterialService;
