"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oee_model_1 = require("../models/oee_model");
class OEEService {
    async index(machine, { page, limit }) {
        const data = await oee_model_1.OEE.paginate({ machine: machine }, { page: page, limit: limit, sort: { _id: -1 } });
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
    async latest(machine) {
        const data = await oee_model_1.OEE.findOne({ machine: machine }, null, {
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
exports.default = OEEService;
