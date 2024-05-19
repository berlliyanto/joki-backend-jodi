import mongoose, { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

export interface AvailabilityDocument extends Document {
  machine: string;
  operation_time: number;
  down_time: number;
  running_time: number;
  state: boolean;
}

const availabilitySchema = new Schema<AvailabilityDocument>(
  {
    machine: {
      type: String,
      required: true,
    },
    operation_time: {
      type: Number,
      required: true,
    },
    down_time: {
      type: Number,
      required: true,
    },
    running_time: {
      type: Number,
      required: true,
    },
    state: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

availabilitySchema.plugin(mongoosePaginate);

export const Availability = mongoose.model<
  AvailabilityDocument,
  mongoose.PaginateModel<AvailabilityDocument>
>("availabilities", availabilitySchema);
