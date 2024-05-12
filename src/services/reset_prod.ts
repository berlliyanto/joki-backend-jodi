import { ResponseInterface } from "../interface/response_interface";
import { Availability } from "../models/availability_model";
import { Parameter } from "../models/parameter_model";
import mongoose from "mongoose";
import { Performance } from "../models/performance_model";
import { Quality } from "../models/quality_model";
import { OEE } from "../models/oee_model";

class ResetProd {
  async resetAll(machine: number): Promise<ResponseInterface> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Parameter.updateMany(
        { machine: machine, state: true },
        { state: false }
      );
      await Availability.updateMany(
        { machine: machine, state: true },
        { state: false }
      );
      await Performance.updateMany(
        { machine: machine, state: true },
        { state: false }
      );
      await Quality.updateMany(
        { machine: machine, state: true },
        { state: false }
      );
      await OEE.updateMany({ machine: machine, state: true }, { state: false });

      await session.commitTransaction();
      return {
        success: true,
        message: "Data reset successfully",
        data: null,
      }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return {
          success: false,
          message: "Error while resetting data : " + error,
          data: null,
        };
    }
  }
}

export default ResetProd;