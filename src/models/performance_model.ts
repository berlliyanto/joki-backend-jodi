import mongoose, { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

export interface PerformanceDocument extends Document {
    machine: number,
    operation_time: number,
    cycle_time: number,
    processed: number,
    state: boolean
}

const performanceSchema = new Schema<PerformanceDocument>({
    machine: {
        type: Number,
        required: true
    },
    operation_time: {
        type: Number,
        required: true
    },
    cycle_time: {
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

performanceSchema.plugin(mongoosePaginate);

export const Performance = mongoose.model<PerformanceDocument, mongoose.PaginateModel<PerformanceDocument>>("performances", performanceSchema)