import mongoose, { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ValuesType } from "../interface/valuesplc_interface";

const { Schema } = mongoose;

export interface TestingDocument extends Document {
  timestamp: number;
  values: ValuesType[];
}

const testingSchema = new Schema<TestingDocument>(
  {
    timestamp: {
      type: Number,
      required: true,
    },
    values: {
      type: [Object] as unknown as ValuesType[],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

testingSchema.plugin(mongoosePaginate);

export const Testing = mongoose.model<
  TestingDocument,
  mongoose.PaginateModel<TestingDocument>
>("testings", testingSchema);
