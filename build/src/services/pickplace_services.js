"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const picknplace_model_1 = require("../models/picknplace_model");
class PickPlaceService {
    async index({ page, limit, }) {
        const data = await picknplace_model_1.PickPlace.paginate({}, { page: page, limit: limit, sort: { _id: -1 } });
        if (!data) {
            return {
                success: false,
                message: "Data not found",
                data: null,
            };
        }
        return {
            success: true,
            message: "Data found",
            data: data,
        };
    }
    async latest() {
        const data = await picknplace_model_1.PickPlace.findOne({}, null, {
            sort: { _id: -1 },
        });
        if (!data) {
            return {
                success: false,
                message: "Data not found",
                data: null,
            };
        }
        return {
            success: true,
            message: "Data found",
            data: data,
        };
    }
}
exports.default = PickPlaceService;
