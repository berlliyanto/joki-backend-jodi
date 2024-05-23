import mongoose, { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

export interface MaterialHistoryDocument extends Document {
  machine: string;
  type: string;
  category: string;
  value: number;
}

const materialHistorySchema = new Schema<MaterialHistoryDocument>(
  {
    machine: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    category : {
        type: String,
        required: true
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

materialHistorySchema.plugin(mongoosePaginate);

export const MaterialHistory = mongoose.model<
  MaterialHistoryDocument,
  mongoose.PaginateModel<MaterialHistoryDocument>
>("materialhistories", materialHistorySchema);
