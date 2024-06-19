"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const material_model_1 = require("../models/material_model");
const materialhistory_model_1 = require("../models/materialhistory_model");
class MaterialService {
    async index(machine, { page, limit }) {
        const data = await materialhistory_model_1.MaterialHistory.paginate({ machine: machine }, { page: page, limit: limit, sort: { _id: -1 } });
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
        const data = await material_model_1.Material.find({ machine: machine }, null, {
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
    async update(machine, { method, type, value }) {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            let data;
            if (method === "add") {
                data = await material_model_1.Material.findOneAndUpdate({ $and: [{ machine: machine }, { type: type }] }, { $inc: { value: value } }, { new: true });
                await materialhistory_model_1.MaterialHistory.create({
                    machine: machine,
                    type: type,
                    category: "In",
                    value: value,
                });
            }
            else if (method === "min") {
                data = await material_model_1.Material.findOneAndUpdate({ $and: [{ machine: machine }, { type: type }] }, { $inc: { value: -value } }, { new: true });
                await materialhistory_model_1.MaterialHistory.create({
                    machine: machine,
                    type: type,
                    category: "Out",
                    value: value,
                });
            }
            else {
                return {
                    success: false,
                    message: "Type not found",
                    data: null,
                };
            }
            if (!data) {
                throw new Error("Data not found");
            }
            return {
                success: true,
                message: "Data Updated",
                data: data,
            };
        }
        catch (error) {
            return {
                success: false,
                message: "Error while updating data : " + error,
                data: null,
            };
        }
    }
}
exports.default = MaterialService;
