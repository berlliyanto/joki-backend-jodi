import mongoose, { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;


export interface ParameterDocument extends Document {
    machine: string,
    loading_time: number,
    cycle_time: number,
    oee_target: number,
    object_type: string,
    state: boolean
}

const parameterSchema = new Schema<ParameterDocument>({
    machine: {
        type: String,
        required: true
    },
    loading_time: {
        type: Number,
        required: true
    },
    cycle_time: {
        type: Number,
        required: true
    },
    oee_target: {
        type: Number,
        required: true
    },
    object_type: {
        type: String,
        required: true
    },
    state: {
        type: Boolean,
        required: true
    }
});

parameterSchema.plugin(mongoosePaginate);

export const Parameter = mongoose.model<ParameterDocument, mongoose.PaginateModel<ParameterDocument>>("paramaters", parameterSchema);