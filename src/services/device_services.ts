import { PaginateOptions } from "mongoose";
import { ResponseInterface } from "../interface/response_interface";
import { Device, ValuesType } from "../models/device_model";
import { PaginationInterface } from "../interface/pagination_interface";

class DeviceServices {
  async index({
    page,
    limit,
  }: PaginationInterface): Promise<ResponseInterface> {
    const options: PaginateOptions = {
      page: page,
      limit: limit,
      sort: { _id: -1 },
    };

    const data = await Device.paginate({}, options);

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

  async pbStatus(): Promise<ResponseInterface> {
    const data = await Device.findOne({}, null, { sort: { _id: -1 } });

    const filteredData = data?.values.filter((item: ValuesType) => {
      return item.id.includes("Emergency") || item.id.includes("PB");
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
      data: filteredData,
    };
  }

  async latestSensor(): Promise<ResponseInterface> {
    const data = await Device.findOne({}, null, { sort: { _id: -1 } });

    const filteredData = data?.values.filter((item: ValuesType) =>
      item.id.includes("Sensor")
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
      data: filteredData,
    };
  }

  async historySensor({
    page,
    limit,
  }: PaginationInterface): Promise<ResponseInterface> {
    const options: PaginateOptions = {
      page: page,
      limit: limit,
      sort: { _id: -1 },
    };

    const data = Device.paginate({}, options);

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

export default DeviceServices;
