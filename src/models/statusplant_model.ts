import mongoose, { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

export interface StatusPlantDocument extends Document {
    testing: boolean,
    pickplace: boolean
}

const statusPlant = new Schema<StatusPlantDocument>({
    testing: {
        type: Boolean,
        required: true
    },
    pickplace: {
        type: Boolean,
        required: true
    }
});

statusPlant.plugin(mongoosePaginate);

export const StatusPlant = mongoose.model<StatusPlantDocument, mongoose.PaginateModel<StatusPlantDocument>>("statusplants", statusPlant);