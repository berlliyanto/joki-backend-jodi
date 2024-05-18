import mongoose, { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ValuesType } from "../interface/valuesplc_interface";

const { Schema } = mongoose;

export interface PickPlaceDocument extends Document {
    timestamp: number,
    values: ValuesType[]
}

const pickPlaceSchema = new Schema<PickPlaceDocument>({
    timestamp: {
        type: Number,
        required: true
    },
    values: {
        type: [Object] as unknown as ValuesType[],
        required: true
    }
});

pickPlaceSchema.plugin(mongoosePaginate);

export const PickPlace = mongoose.model<PickPlaceDocument, mongoose.PaginateModel<PickPlaceDocument>>("pickplaces", pickPlaceSchema);