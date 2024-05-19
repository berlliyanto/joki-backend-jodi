import { ChangeStreamDocumentInterface } from "../interface/changestream_interface";
import { PickPlace } from "../models/picknplace_model";
import { Quality } from "../models/quality_model";
import { Testing } from "../models/testing_model";

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
        const newestDocument = await model.findOne({}, null, {
          sort: { _id: -1 },
        });

        if (newestDocument && typeof newestDocument.values[0].v === "number") {
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
      }
    });
  }
}

export default QualityStream;
