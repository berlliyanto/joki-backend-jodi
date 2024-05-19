import { ChangeStreamDocumentInterface } from "../interface/changestream_interface";
import { Availability } from "../models/availability_model";
import { Performance } from "../models/performance_model";
import { Quality } from "../models/quality_model";
import { getParameter } from "../utils/get_parameter";

class PerformanceStream {
  protected pickPlaceProcessed: number;
  protected testingProcessed: number;
  protected pickPlaceOperationTime: number;
  protected testingOperationTime: number;

  constructor() {
    this.pickPlaceProcessed = 0;
    this.testingProcessed = 0;
    this.pickPlaceOperationTime = 0;
    this.testingOperationTime = 0;
    this.streamQuality();
    this.streamAvailability();
    this.countingTime();
  }

  private async streamAvailability(): Promise<void> {
    const watchStream = Availability.watch();

    watchStream.on("change", async (change: ChangeStreamDocumentInterface) => {
      if (change.operationType === "update") {
        const newestPickPlace = await Availability.findOne(
          {
            machine: "p&place",
            state: true,
          },
          null,
          {
            sort: { _id: -1 },
          }
        );

        const newestTesting = await Availability.findOne(
          {
            machine: "testing",
            state: true,
          },
          null,
          {
            sort: { _id: -1 },
          }
        );

        if (
          newestPickPlace &&
          typeof newestPickPlace.operation_time === "number"
        ) {
          this.pickPlaceOperationTime = newestPickPlace.operation_time / 60;
        }

        if (newestTesting && typeof newestTesting.operation_time === "number") {
          this.testingOperationTime = newestTesting.operation_time / 60;
        }
      }
    });
  }

  private async streamQuality(): Promise<void> {
    const watchStream = Quality.watch();

    watchStream.on("change", async (change: ChangeStreamDocumentInterface) => {
      if (change.operationType === "update") {
        const newestPickPlace = await Quality.findOne(
          {
            machine: "p&place",
            state: true,
          },
          null,
          {
            sort: { _id: -1 },
          }
        );

        const newestTesting = await Quality.findOne(
          {
            machine: "testing",
            state: true,
          },
          null,
          {
            sort: { _id: -1 },
          }
        );

        if (newestPickPlace && typeof newestPickPlace.processed === "number") {
          this.pickPlaceProcessed = newestPickPlace.processed;
        }

        if (newestTesting && typeof newestTesting.processed === "number") {
          this.testingProcessed = newestTesting.processed;
        }
      }
    });
  }

  private countingTime(): void {
    setInterval(() => {
      this.setPerformance("p&place");
      this.setPerformance("testing");
    }, 1000);
  }

  private async setPerformance(machine: string): Promise<void> {
    const performance = await Performance.findOne({
      machine: machine,
      state: true,
    });

    if (!performance) return;

    const { cycle_time, state: stateParameter } = await getParameter(machine);

    if (machine === "p&place") {
      if (
        this.pickPlaceProcessed <= 0 &&
        this.pickPlaceOperationTime <= 0 &&
        cycle_time <= 0
      )
        return;

      if (!stateParameter) return;

      await Performance.updateOne(
        {
          $and: [{ machine: machine, state: true }],
        },
        {
          $set: {
            processed: this.pickPlaceProcessed,
            operation_time: this.pickPlaceOperationTime,
            cycle_time: cycle_time,
          },
        }
      );
    } else if (machine === "testing") {
      if (
        this.testingProcessed <= 0 &&
        this.testingOperationTime <= 0 &&
        cycle_time <= 0
      )
        return;

      if (!stateParameter) return;

      await Performance.updateOne(
        {
          $and: [{ machine: machine, state: true }],
        },
        {
          $set: {
            processed: this.testingProcessed,
            operation_time: this.testingOperationTime,
            cycle_time: cycle_time,
          },
        }
      );
    } else {
      throw new Error("Invalid machine type");
    }
  }
}

export default PerformanceStream;
