import { Availability } from "../models/availability_model";
import { StatusPlant, ValuePlantType } from "../models/statusplant_model";
import { getParameter } from "../utils/get_parameter";

class AvailabilityStream {
  protected pickPlaceData: ValuePlantType | undefined;
  protected testingData: ValuePlantType | undefined;
  protected timePickPlace: number;
  protected timeTesting: number;

  constructor() {
    this.timePickPlace = 0;
    this.timeTesting = 0;
    this.streamStatus();
    this.countingTime();
  }

  private async streamStatus(): Promise<void> {
    const watchStream = StatusPlant.watch();
    watchStream.on("change", async (change) => {
      if (change.operationType === "update") {
        const newestDocument = await StatusPlant.findOne({}, null, {
          sort: { _id: -1 },
        });

        if (newestDocument) {
          this.pickPlaceData = newestDocument.pickplace;
          this.testingData = newestDocument.testing;
        }

      }
    });
  }

  private countingTime(): void {
    setInterval(() => {
      this.setAvailability("p&place");
      this.setAvailability("testing");
    }, 1000);
  }

  private async setAvailability(machine: string): Promise<void> {
    const availability = await Availability.findOne({
      machine: machine,
      state: true,
    });

    const { loading_time: loadingTime, state: stateParameter } =
      await getParameter(machine);

    if (machine === "p&place") {
      if (!availability || !stateParameter) {
        this.timePickPlace = 0;
        return;
      }

      if (this.timePickPlace < loadingTime * 60) {
        if (this.pickPlaceData?.pb_start && !this.pickPlaceData?.pb_stop) {
          this.timePickPlace++;

          await Availability.findOneAndUpdate(
            { $and: [{ machine: machine }, { state: true }] },
            { $inc: { operation_time: 1, running_time: 1 } }
          );
        } else if (
          !this.pickPlaceData?.pb_start &&
          this.pickPlaceData?.pb_stop
        ) {
          this.timePickPlace++;

          await Availability.findOneAndUpdate(
            { $and: [{ machine: machine }, { state: true }] },
            { $inc: { running_time: 1, down_time: 1 } }
          );
        }
      } else {
        this.timePickPlace = 0;
        await Availability.findOneAndUpdate(
          { $and: [{ machine: machine }, { state: true }] },
          { $set: { state: false } }
        );
      }
    } else if (machine === "testing") {
      if (!availability || !stateParameter) {
        this.timeTesting = 0;
        return;
      }

      if (this.timeTesting < loadingTime * 60) {
        if (this.testingData?.pb_start && !this.testingData?.pb_stop) {
          this.timeTesting++;

          await Availability.findOneAndUpdate(
            { $and: [{ machine: machine }, { state: true }] },
            { $inc: { operation_time: 1, running_time: 1 } }
          );
        } else if (!this.testingData?.pb_start && this.testingData?.pb_stop) {
          this.timeTesting++;

          await Availability.findOneAndUpdate(
            { $and: [{ machine: machine }, { state: true }] },
            { $inc: { operation_time: 1, down_time: 1 } }
          );
        }
      } else {
        this.timeTesting = 0;
        await Availability.findOneAndUpdate(
          { $and: [{ machine: machine }, { state: true }] },
          { $set: { state: false } }
        );
      }
    } else {
      throw new Error("Invalid machine type");
    }
  }
}

export default AvailabilityStream;
