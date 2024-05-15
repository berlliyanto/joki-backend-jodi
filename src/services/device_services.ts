import mongoose from "mongoose";
import { ResponseInterface } from "../interface/response_interface";
import { PickPlace } from "../models/picknplace_model";
import { Testing } from "../models/testing_model";
import { ValuesType } from "../interface/valuesplc_interface";
import { StatusPlant } from "../models/statusplant_model";

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
      const pickPlace = await PickPlace.create({
        values: pickplaceData,
        timestamp,
      });
      const testing = await Testing.create({ values: testingData, timestamp });

      const pickplaceStatus = pickplaceData.filter((item: ValuesType) =>
        item._id.includes("PB_")
      );
      pickplaceStatus.forEach(async (v: ValuesType) => {
        if (v.v === "1") {
          if (v._id.includes("PB_Start")) {
            await StatusPlant.updateOne({}, { $set: { pickPlace: true } });
          } else if (v._id.includes("PB_Stop")) {
            await StatusPlant.updateOne({}, { $set: { pickPlace: false } });
          }
        }
      });

      const testingStatus = testingData.filter((item: ValuesType) =>
        item._id.includes("PB_")
      );
      testingStatus.forEach(async (v: ValuesType) => {
        if (v.v === "1") {
          if (v._id.includes("PB_Start")) {
            await StatusPlant.updateOne({}, { $set: { testing: true } });
          } else if (v._id.includes("PB_Stop")) {
            await StatusPlant.updateOne({}, { $set: { testing: false } });
          }
        }
      });

      await session.commitTransaction();
      return {
        success: true,
        message: "Data created",
        data: { pickPlace, testing },
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
}

export default DeviceServices;
