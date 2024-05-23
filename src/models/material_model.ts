import mongoose, { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

export interface MaterialDocument extends Document {
  machine: string;
  type: string;
  value: number;
}

const materialSchema = new Schema<MaterialDocument>(
  {
    machine: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

materialSchema.plugin(mongoosePaginate);

export const Material = mongoose.model<
  MaterialDocument,
  mongoose.PaginateModel<MaterialDocument>
>("materials", materialSchema);
