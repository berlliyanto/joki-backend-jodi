import mongoose, { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface TroubleshootDocument extends Document {
  machine: string;
  name: string;
  problem: string;
  state: string;
  date: Date;
}

const { Schema } = mongoose;

const troubleshootSchema = new Schema<TroubleshootDocument>(
  {
    machine: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    problem: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

troubleshootSchema.plugin(mongoosePaginate);

const Troubleshoot = mongoose.model<
  TroubleshootDocument,
  mongoose.PaginateModel<TroubleshootDocument>
>("troubleshoots", troubleshootSchema);

export default Troubleshoot;
