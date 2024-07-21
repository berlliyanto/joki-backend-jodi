import { ChangeStreamDocumentInterface } from "../interface/changestream_interface";
import { Material } from "../models/material_model";
import { MaterialHistory } from "../models/materialhistory_model";
import { PickPlace } from "../models/picknplace_model";
import { Quality } from "../models/quality_model";
import { Testing } from "../models/testing_model";
import { getParameter } from "../utils/get_parameter";

class QualityStream {
  constructor() {
    this.counting("p&place");
    this.counting("testing");
  }

  private async counting(machine: string): Promise<void> {
    let model;
    if (machine === "p&place") {
      model = PickPlace;
    } else if (machine === "testing") {
      model = Testing;
    } else {
      throw new Error("Invalid machine type");
    }

    let count: number = 0;
    const watchStream = model.watch();
    watchStream.on("change", async (change: ChangeStreamDocumentInterface) => {
      if (change.operationType === "insert") {
        try {
          const newestDocument = await model.findOne({}, null, {
            sort: { _id: -1 },
          });

          if (
            newestDocument &&
            typeof newestDocument.values[0].v === "number"
          ) {
            count = newestDocument.values[0].v;
          }

          await Quality.findOneAndUpdate(
            { $and: [{ machine: machine }, { state: true }] },
            {
              $set: {
                processed: count,
                good: count,
              },
            }
          );

          if (
            newestDocument?.values[4].v === false &&
            newestDocument?.values[5].v === true
          ) {
            await Quality.findOneAndUpdate(
              { machine: machine },
              { $inc: { defect: 1, processed: 1 } }
            );
          }

          await this.updateMaterial(machine, count);
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  private async updateMaterial(machine: string, count: number): Promise<void> {
    const parameter = await getParameter(machine);
    if (!parameter) return;

    await Material.findOneAndUpdate(
      { machine: machine },
      { $inc: { count: -count } },
      { new: true }
    );

    // await MaterialHistory.create({
    //   machine: machine,
    //   type: parameter.object_type,
    //   category: "Out",
    //   value: count,
    // });
  }
}

export default QualityStream;
