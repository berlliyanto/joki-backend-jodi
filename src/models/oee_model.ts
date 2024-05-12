import mongoose, { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

export interface OEEDocument extends Document {
    machine: string,
    availability: number,
    quality: number,
    performance: number,
    state: boolean
}

const oeeSchema = new Schema<OEEDocument>({
    machine: {
        type: String,
        required: true
    },
    availability: {
        type: Number,
        required: true
    },
    quality: {
        type: Number,
        required: true
    },
    performance: {
        type: Number,
        required: true
    },
    state: {
        type: Boolean,
        required: true 
    }
});

oeeSchema.plugin(mongoosePaginate);

export const OEE = mongoose.model<OEEDocument, mongoose.PaginateModel<OEEDocument>>("oees", oeeSchema)