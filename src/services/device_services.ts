import { PaginateOptions } from "mongoose";
import { ResponseInterface } from "../interface/response_interface";
import { Device, ValuesType } from "../models/device_model";
import { PaginationInterface } from "../interface/pagination_interface";

interface PaginateDocsInterface {
  _id: string;
  timestamp: number;
  values: ValuesType[];
}

class DeviceServices {
  async index(
    machine: string,
    { page, limit }: PaginationInterface
  ): Promise<ResponseInterface> {
    const options: PaginateOptions = {
      page: page,
      limit: limit,
      sort: { _id: -1 },
    };

    const data = await Device.paginate({}, options);

    // const filteredData = data.docs.filter((item: PaginateDocsInterface) => {
    //   return item.values.some((value: ValuesType) => value.id.includes(machine));
    // });

    if (!data || data.docs.length === 0) {
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

  async input(body: any): Promise<ResponseInterface> {
    console.log(body);
    const data = await Device.create(body);
    if (!data) {
      return {
        success: false,
        message: "Date failed to create",
        data: null,
      };
    }
    return {
      success: true,
      message: "Data created",
      data: data,
    };
  }

  async pbStatus(machine: string): Promise<ResponseInterface> {
    const data = await Device.findOne({}, null, { sort: { _id: -1 } });

    const filteredData = data?.values.filter((item: ValuesType) => {
      return (
        item.id.includes(machine) &&
        (item.id.includes("Emergency") || item.id.includes("PB"))
      );
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

  async latestSensor(machine: string): Promise<ResponseInterface> {
    const data = await Device.findOne({}, null, { sort: { _id: -1 } });

    const filteredData = data?.values.filter(
      (item: ValuesType) =>
        item.id.includes(machine) && item.id.includes("Sensor")
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

  async historySensor(
    machine: string,
    { page, limit }: PaginationInterface
  ): Promise<ResponseInterface> {
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
