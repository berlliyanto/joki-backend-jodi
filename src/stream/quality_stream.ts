import { PickPlace } from "../models/picknplace_model";
import { Quality } from "../models/quality_model";
import { Testing } from "../models/testing_model";

class QualityStream {
  static async counting(machine: string): Promise<void> {
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
          console.log("Pickplace");
          console.table(newestpickplace);

          await Quality.findOneAndUpdate(
            { $and: [{ machine: "p&place" }, { state: true }] },
            {
              $set: {
                processed: count,
                good: count,
              },
            }
          );
        }
      });
    } else if (machine === "testing") {
      let count: number = 0;
      const testingWatch = Testing.watch();
      testingWatch.on("change", async (change) => {
        if (change.operationType === "insert") {
          const newestTesting = await Testing.findOne({}, null, {
            sort: { _id: -1 },
          });

          console.log("Testing");
          console.table(newestTesting);

            if (typeof newestTesting!.values[0].v === "number") {
              count = newestTesting!.values[0].v;
            }

          await Quality.findOneAndUpdate(
            { $and: [{ machine: "testing" }, { state: true }] },
            {
              $set: {
                processed: count,
                good: count,
              },
            }
          );
        }
      });
    }
  }
}

export default QualityStream;
