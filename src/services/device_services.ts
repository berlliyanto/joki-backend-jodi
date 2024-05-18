import mongoose from "mongoose";
import { ResponseInterface } from "../interface/response_interface";
import { PickPlace } from "../models/picknplace_model";
import { Testing } from "../models/testing_model";
import { ValuesType } from "../interface/valuesplc_interface";
import { StatusPlant } from "../models/statusplant_model";
import { Quality } from "../models/quality_model";

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

  private async pickPlace(
    pickPlaceData: ValuesType[],
    timestamp: number
  ): Promise<void> {
    await PickPlace.create({
      values: pickPlaceData,
      timestamp,
    });

    const name = pickPlaceData[0].id.split(".")[1];
    await this.quality(name);

    const pickplaceStatus = pickPlaceData.filter((item: ValuesType) =>
      item.id.includes("PB_")
    );
    pickplaceStatus.forEach(async (v: ValuesType) => {
      if (v.id.includes("PB_Start")) {
        if (v.v === true) {
          await StatusPlant.updateOne({}, { $set: { pickplace: true } });
        }
      }

      if (v.id.includes("PB_Stop")) {
        if (v.v === false) {
          await StatusPlant.updateOne({}, { $set: { pickplace: false } });
        }
      }
    });
  }

  private async testing(
    testingData: ValuesType[],
    timestamp: number
  ): Promise<void> {
    await Testing.create({ values: testingData, timestamp });

    const name = testingData[0].id.split(".")[1];
    await this.quality(name);

    const testingStatus = testingData.filter((item: ValuesType) =>
      item.id.includes("PB_")
    );
    testingStatus.forEach(async (v: ValuesType) => {
      if (v.id.includes("PB_Start")) {
        if (v.v === true) {
          await StatusPlant.updateOne({}, { $set: { testing: true } });
        }
      }

      if (v.id.includes("PB_Stop")) {
        if (v.v === false) {
          await StatusPlant.updateOne({}, { $set: { testing: false } });
        }
      }
    });
  }

  private async quality(machine: string): Promise<void> {
    if (machine === "p&place") {
      let count: number = 0;
      const pickplaceWatch = PickPlace.watch();
      pickplaceWatch.on("change", async (change) => {
        if (change.operationType === "insert") {
          const newestpickplace = await PickPlace.findOne({}, null, {
            sort: { _id: -1 },
          });

          if (typeof newestpickplace!.values[0].v === "number") {
            count = newestpickplace!.values[0].v;
          }
        }
      });

      const update = await Quality.findOneAndUpdate(
        { $and: [{ machine: "p&place" }, { state: true }] },
        {
          $set: {
            processed: count,
            good: count,
          },
        }
      );

      console.log(count);
      console.log(update);

    } else if (machine === "testing") {
      let count: number = 0;
      const testingWatch = Testing.watch();
      testingWatch.on("change", async (change) => {
        if (change.operationType === "insert") {
          const newestTesting = await Testing.findOne({}, null, {
            sort: { _id: -1 },
          });

          if (typeof newestTesting!.values[0].v === "number") {
            count = newestTesting!.values[0].v;
          }
        }
      });

      const update = await Quality.findOneAndUpdate(
        { $and: [{ machine: "testing" }, { state: true }] },
        {
          $set: {
            processed: count,
            good: count,
          },
        }
      );

      console.log(count);
      console.log(update);
    }
  }
}

export default DeviceServices;
