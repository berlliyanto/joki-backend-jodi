import mongoose, { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

export type ValuesType = {
    id: string,
    v: string,
    q: boolean,
    t: number,
    _id: string
}

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