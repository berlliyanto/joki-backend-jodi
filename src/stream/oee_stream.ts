import { Availability } from "../models/availability_model";
import { OEE } from "../models/oee_model";
import { Performance } from "../models/performance_model";
import { Quality } from "../models/quality_model";

type OeeType = {
  availability: number;
  quality: number;
  performance: number;
};

class OeeStream {
  protected pickPlaceOEE: OeeType;
  protected testingOEE: OeeType;

  constructor() {
    this.pickPlaceOEE = {
      availability: 0,
      quality: 0,
      performance: 0,
    };
    this.testingOEE = {
      availability: 0,
      quality: 0,
      performance: 0,
    };

    this.countingTime();
  }

  private countingTime(): void {
    setInterval(() => {
      this.setAvailability("p&place");
      this.setPeformance("p&place");
      this.setQuality("p&place");
      this.setAvailability("testing");
      this.setPeformance("testing");
      this.setQuality("testing");
      this.setOEE("p&place");
      this.setOEE("testing");

      // console.log(this.testingOEE)
    }, 1000);
  }

  private async setOEE(machine: string): Promise<void> {
    let data: OeeType | undefined;
    if (machine === "p&place") {
      data = this.pickPlaceOEE;
    } else if (machine === "testing") {
      data = this.testingOEE;
    } else {
      throw new Error("Invalid machine type");
    }

    if (!data) return;
    if (data.availability <= 0 || data.quality <= 0 || data.performance <= 0)
      return;

    console.log(data);

    await OEE.findOneAndUpdate(
      { machine: machine, state: true },
      {
        $set: {
          availability: data.availability,
          quality: data.quality,
          performance: data.performance,
          oee: (data.availability * data.quality * data.performance) / 100,
        },
      }
    );
  }

  private async setAvailability(machine: string): Promise<void> {
    const availability = await Availability.findOne(
      {
        machine: machine,
        state: true,
      },
      null,
      {
        sort: { _id: -1 },
      }
    );

    if (!availability) return;
    if (availability.operation_time <= 0) return;

    if (machine === "p&place") {
      this.pickPlaceOEE = {
        ...this.pickPlaceOEE,
        availability:
          (availability.operation_time - availability.down_time) /
          availability.operation_time,
      };
    }

    if (machine === "testing") {
      this.testingOEE = {
        ...this.testingOEE,
        availability:
          (availability.operation_time - availability.down_time) /
          availability.operation_time,
      };
    }
  }

  private async setPeformance(machine: string): Promise<void> {
    const performance = await Performance.findOne(
      {
        machine: machine,
        state: true,
      },
      null,
      {
        sort: { _id: -1 },
      }
    );

    if (!performance) return;
    if (performance.cycle_time <= 0 || performance.operation_time <= 0) return;

    if (machine === "p&place") {
      this.pickPlaceOEE = {
        ...this.pickPlaceOEE,
        performance:
          (performance.processed * performance.cycle_time) /
          (performance.operation_time / 60),
      };
    }

    if (machine === "testing") {
      this.testingOEE = {
        ...this.testingOEE,
        performance:
          (performance.processed * performance.cycle_time) /
          (performance.operation_time / 60),
      };
    }
  }

  private async setQuality(machine: string): Promise<void> {
    const quality = await Quality.findOne(
      {
        machine: machine,
        state: true,
      },
      null,
      {
        sort: { _id: -1 },
      }
    );

    if (!quality) return;
    if(quality.processed <= 0) return;

    if (machine === "p&place") {
      this.pickPlaceOEE = {
        ...this.pickPlaceOEE,
        quality: (quality.processed - quality.defect) / quality.processed,
      };
    }

    if (machine === "testing") {
      this.testingOEE = {
        ...this.testingOEE,
        quality: (quality.processed - quality.defect) / quality.processed,
      };
    }
  }
}

export default OeeStream;
