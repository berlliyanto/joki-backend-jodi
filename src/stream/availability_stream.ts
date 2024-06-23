import { ChangeStreamDocumentInterface } from "../interface/changestream_interface";
import { Availability } from "../models/availability_model";
import { StatusPlant, ValuePlantType } from "../models/statusplant_model";
import { getParameter } from "../utils/get_parameter";

class AvailabilityStream {
  protected pickPlaceData: ValuePlantType | undefined;
  protected testingData: ValuePlantType | undefined;
  protected timePickPlace: number;
  protected timeTesting: number;
  protected timeRunPickPlace: number;
  protected timeRunTesting: number;
  protected timeDownPickPlace: number;
  protected timeDownTesting: number;

  constructor() {
    this.timePickPlace = 0;
    this.timeTesting = 0;
    this.timeRunPickPlace = 0;
    this.timeRunTesting = 0;
    this.timeDownPickPlace = 0;
    this.timeDownTesting = 0;
    this.countingTime();
  }

  private async streamStatus(): Promise<void> {
    // const watchStream = StatusPlant.watch();
    // watchStream.on("change", async (change : ChangeStreamDocumentInterface) => {
    //   if (change.operationType === "update") {

    //   }
    // });

    const newestDocument = await StatusPlant.findOne({}, null, {
      sort: { _id: -1 },
    });

    if (newestDocument) {
      this.pickPlaceData = newestDocument.pickplace;
      this.testingData = newestDocument.testing;
    }
  }

  private countingTime(): void {
    setInterval(() => {
      this.streamStatus();
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
        this.timeRunPickPlace = 0;
        this.timeDownPickPlace = 0;
        return;
      }

      if (this.timePickPlace < loadingTime * 60) {
        if (this.pickPlaceData?.pb_start && !this.pickPlaceData?.pb_stop) {
          this.timePickPlace++;
          this.timeRunPickPlace++;

          await Availability.findOneAndUpdate(
            { $and: [{ machine: machine }, { state: true }] },
            { $set: { operation_time: this.timePickPlace, running_time: this.timeRunPickPlace } }
          );
        } else if (
          !this.pickPlaceData?.pb_start &&
          this.pickPlaceData?.pb_stop
        ) {
          this.timePickPlace++;
          this.timeDownPickPlace++;

          await Availability.findOneAndUpdate(
            { $and: [{ machine: machine }, { state: true }] },
            { $inc: { running_time: this.timePickPlace, down_time: this.timeDownPickPlace } }
          );
        }
      } else {
        this.timePickPlace = 0;
        this.timeRunPickPlace = 0;
        this.timeDownPickPlace = 0;
        await Availability.findOneAndUpdate(
          { $and: [{ machine: machine }, { state: true }] },
          { $set: { state: false } }
        );
      }
    } else if (machine === "testing") {
      if (!availability || !stateParameter) {
        this.timeTesting = 0;
        this.timeRunTesting = 0;
        this.timeDownTesting = 0;
        return;
      }

      if (this.timeTesting < loadingTime * 60) {
        if (this.testingData?.pb_start && !this.testingData?.pb_stop) {
          this.timeTesting++;
          this.timeRunTesting++;

          await Availability.findOneAndUpdate(
            { $and: [{ machine: machine }, { state: true }] },
            { $set: { operation_time: this.timeTesting, running_time: this.timeRunTesting } }
          );
        } else if (!this.testingData?.pb_start && this.testingData?.pb_stop) {
          this.timeTesting++;
          this.timeDownTesting++;

          await Availability.findOneAndUpdate(
            { $and: [{ machine: machine }, { state: true }] },
            { $set: { operation_time: this.timeTesting, down_time: this.timeDownTesting } }
          );
        }
      } else {
        this.timeTesting = 0;
        this.timeRunTesting = 0;
        this.timeDownTesting = 0;
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
