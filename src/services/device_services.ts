import mongoose from "mongoose";
import { ResponseInterface } from "../interface/response_interface";
import { PickPlace } from "../models/picknplace_model";
import { Testing } from "../models/testing_model";
import { ValuesType } from "../interface/valuesplc_interface";
import { StatusPlant } from "../models/statusplant_model";
import { Quality } from "../models/quality_model";
import { getParameter } from "../utils/get_parameter";
import { Availability } from "../models/availability_model";

interface PaginateDocsInterface {
  timestamp: number;
  values: ValuesType[];
}

class DeviceServices {
  async input(body: PaginateDocsInterface): Promise<ResponseInterface> {
    const { timestamp, values } = body;
    let pickplaceData: ValuesType[] = [];
    let testingData: ValuesType[] = [];

    values.forEach((value: ValuesType) => {
      if (value.id.includes("p&place")) {
        pickplaceData.push(value);
      } else if (value.id.includes("testing")) {
        testingData.push(value);
      }
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await this.pickPlace(pickplaceData, timestamp);
      await this.testing(testingData, timestamp);

      await session.commitTransaction();
      return {
        success: true,
        message: "Data created",
        data: body,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message: "Error while creating data : " + error,
        data: null,
      };
    }
  }

  async monitorProduction(machine: string): Promise<ResponseInterface> {
    try {
      const parameter = await getParameter(machine);
      const quality = await Quality.findOne(
        { machine: machine, state: true },
        null,
        { sort: { _id: -1 } }
      );
      const availability = await Availability.findOne(
        { machine: machine, state: true },
        null,
        { sort: { _id: -1 } }
      );

      const data = {
        machine: machine,
        object_type: parameter.object_type,
        target: parameter.target_count,
        actual: quality?.processed ?? 0,
        defect: quality?.defect ?? 0,
        stock_material: 0,
        operation_time: availability?.operation_time,
        running_time: availability?.running_time,
        down_time: availability?.down_time,
      };

      return {
        success: true,
        message: "Data fetched",
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error while getting data : " + error,
        data: null,
      };
    }
  }

  async statusPlant(): Promise<ResponseInterface> {
    const status = await StatusPlant.findOne({}, null, { sort: { _id: -1 } });
    return {
      success: true,
      message: "Data fetched",
      data: status,
    };
  }

  private async pickPlace(
    pickPlaceData: ValuesType[],
    timestamp: number
  ): Promise<void> {
    await PickPlace.create({
      values: pickPlaceData,
      timestamp,
    });

    const pickplaceStatus = pickPlaceData.filter((item: ValuesType) =>
      item.id.includes("PB_")
    );
    pickplaceStatus.forEach(async (v: ValuesType) => {
      if (v.id.includes("PB_Start")) {
        if (v.v === true) {
          await StatusPlant.updateOne(
            {},
            {
              $set: {
                pickplace: { status: true, pb_start: true, pb_stop: false },
              },
            }
          );
        }
      }

      if (v.id.includes("PB_Stop")) {
        if (v.v === false) {
          await StatusPlant.updateOne(
            {},
            {
              $set: {
                pickplace: { status: true, pb_start: false, pb_stop: true },
              },
            }
          );
        }
      }
    });
  }

  private async testing(
    testingData: ValuesType[],
    timestamp: number
  ): Promise<void> {
    await Testing.create({ values: testingData, timestamp });
    const testingStatus = testingData.filter((item: ValuesType) =>
      item.id.includes("PB_")
    );

    console.log(testingStatus);
    
    testingStatus.forEach(async (v: ValuesType) => {
      if (v.id.includes("PB_Start")) {
        if (v.v === true) {
          await StatusPlant.updateOne(
            {},
            {
              $set: {
                testing: { status: true, pb_start: true, pb_stop: false },
              },
            }
          );
        }
      }

      if (v.id.includes("PB_Stop")) {
        if (v.v === false) {
          await StatusPlant.updateOne(
            {},
            {
              $set: {
                testing: { status: false, pb_start: false, pb_stop: true },
              },
            }
          );
        }
      }
    });
  }
}

export default DeviceServices;
