import { Request, Response } from "express";
import BaseRoutes from "./base_routes";
import AuthController from "../controllers/auth_controller";
import DeviceController from "../controllers/device_controller";
import { auth } from "../middlewares/auth_middleware";
import ParameterController from "../controllers/parameter_controller";

const authC = new AuthController();
const deviceC = new DeviceController();
const parameterC = new ParameterController();

class Routes extends BaseRoutes {
  constructor() {
    super();
    this.routes();
  }

  routes(): void {
    this.router.get("/", (req: Request, res: Response) => {
      res.send("Hello World!");
    });

    //Auth
    this.router.post("/login", authC.login);
    this.router.post("/register", authC.register);

    //Device
    this.router.post("/devices/input", deviceC.input);
    this.router.get("/devices", auth, deviceC.index);
    this.router.get("/devices/pb-status", auth, deviceC.pbStatus);
    this.router.get("/devices/latest-sensor", auth, deviceC.latestSensor);
    this.router.get("/devices/history-sensor", auth, deviceC.historySensor);

    //Parameter
    this.router.get("/parameter/:machine", auth, parameterC.index);
    this.router.get("/parameter/latest/:machine", auth, parameterC.latest);
    this.router.post("/parameter/new", auth, parameterC.new);
    this.router.post("/parameter/reset/:machine", auth, parameterC.reset);
  }
}

export default Routes;
