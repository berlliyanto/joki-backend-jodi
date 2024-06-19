"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const availability_model_1 = require("../models/availability_model");
const statusplant_model_1 = require("../models/statusplant_model");
const get_parameter_1 = require("../utils/get_parameter");
class AvailabilityStream {
    pickPlaceData;
    testingData;
    timePickPlace;
    timeTesting;
    constructor() {
        this.timePickPlace = 0;
        this.timeTesting = 0;
        this.streamStatus();
        this.countingTime();
    }
    async streamStatus() {
        const watchStream = statusplant_model_1.StatusPlant.watch();
        watchStream.on("change", async (change) => {
            if (change.operationType === "update") {
                const newestDocument = await statusplant_model_1.StatusPlant.findOne({}, null, {
                    sort: { _id: -1 },
                });
                if (newestDocument) {
                    this.pickPlaceData = newestDocument.pickplace;
                    this.testingData = newestDocument.testing;
                }
            }
        });
    }
    countingTime() {
        setInterval(() => {
            this.setAvailability("p&place");
            this.setAvailability("testing");
        }, 1000);
    }
    async setAvailability(machine) {
        const availability = await availability_model_1.Availability.findOne({
            machine: machine,
            state: true,
        });
        const { loading_time: loadingTime, state: stateParameter } = await (0, get_parameter_1.getParameter)(machine);
        if (machine === "p&place") {
            if (!availability || !stateParameter) {
                this.timePickPlace = 0;
                return;
            }
            if (this.timePickPlace < loadingTime * 60) {
                if (this.pickPlaceData?.pb_start && !this.pickPlaceData?.pb_stop) {
                    this.timePickPlace++;
                    await availability_model_1.Availability.findOneAndUpdate({ $and: [{ machine: machine }, { state: true }] }, { $inc: { operation_time: 1, running_time: 1 } });
                }
                else if (!this.pickPlaceData?.pb_start &&
                    this.pickPlaceData?.pb_stop) {
                    this.timePickPlace++;
                    await availability_model_1.Availability.findOneAndUpdate({ $and: [{ machine: machine }, { state: true }] }, { $inc: { running_time: 1, down_time: 1 } });
                }
            }
            else {
                this.timePickPlace = 0;
                await availability_model_1.Availability.findOneAndUpdate({ $and: [{ machine: machine }, { state: true }] }, { $set: { state: false } });
            }
        }
        else if (machine === "testing") {
            if (!availability || !stateParameter) {
                this.timeTesting = 0;
                return;
            }
            if (this.timeTesting < loadingTime * 60) {
                if (this.testingData?.pb_start && !this.testingData?.pb_stop) {
                    this.timeTesting++;
                    await availability_model_1.Availability.findOneAndUpdate({ $and: [{ machine: machine }, { state: true }] }, { $inc: { operation_time: 1, running_time: 1 } });
                }
                else if (!this.testingData?.pb_start && this.testingData?.pb_stop) {
                    this.timeTesting++;
                    await availability_model_1.Availability.findOneAndUpdate({ $and: [{ machine: machine }, { state: true }] }, { $inc: { operation_time: 1, down_time: 1 } });
                }
            }
            else {
                this.timeTesting = 0;
                await availability_model_1.Availability.findOneAndUpdate({ $and: [{ machine: machine }, { state: true }] }, { $set: { state: false } });
            }
        }
        else {
            throw new Error("Invalid machine type");
        }
    }
}
exports.default = AvailabilityStream;
