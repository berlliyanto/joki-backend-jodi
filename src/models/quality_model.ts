import mongoose, { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

export interface QualitySchema extends Document {
    machine: number,
    good: number,
    defect: number,
    processed: number,
    state: boolean
}

const qualitySchema = new Schema<QualitySchema>({
    machine: {
        type: Number,
        required: true
    },
    good: {
        type: Number,
        required: true
    },
    defect: {
        type: Number,
        required: true
    },
    processed: {
        type: Number,
        required: true
    },
    state: {
        type: Boolean,
        required: true 
    }
});

qualitySchema.plugin(mongoosePaginate);

export const Quality = mongoose.model<QualitySchema, mongoose.PaginateModel<QualitySchema>>("qualities", qualitySchema)