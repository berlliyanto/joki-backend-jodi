import mongoose, { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

export type ValuePlantType = {
  status: boolean;
  pb_start: boolean;
  pb_stop: boolean;
};

export interface StatusPlantDocument extends Document {
  testing: ValuePlantType;
  pickplace: ValuePlantType;
}

const statusPlant = new Schema<StatusPlantDocument>(
  {
    testing: {
      type: Object,
      required: true,
    },
    pickplace: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

statusPlant.plugin(mongoosePaginate);

export const StatusPlant = mongoose.model<
  StatusPlantDocument,
  mongoose.PaginateModel<StatusPlantDocument>
>("statusplants", statusPlant);
