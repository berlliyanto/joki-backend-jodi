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

export interface DeviceDocument extends Document {
    timestamp: number,
    values: ValuesType[]
}

const deviceSchema = new Schema<DeviceDocument>({
    timestamp: {
        type: Number,
        required: true
    },
    values: {
        type: [Object] as unknown as ValuesType[],
        required: true
    }
});

deviceSchema.plugin(mongoosePaginate);

export const Device = mongoose.model<DeviceDocument, mongoose.PaginateModel<DeviceDocument>>("devices", deviceSchema);