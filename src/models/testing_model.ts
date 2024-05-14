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

export interface TestingDocument extends Document {
    timestamp: number,
    values: ValuesType[]
}

const testingSchema = new Schema<TestingDocument>({
    timestamp: {
        type: Number,
        required: true
    },
    values: {
        type: [Object] as unknown as ValuesType[],
        required: true
    }
});

testingSchema.plugin(mongoosePaginate);

export const Testing = mongoose.model<TestingDocument, mongoose.PaginateModel<TestingDocument>>("testings", testingSchema);