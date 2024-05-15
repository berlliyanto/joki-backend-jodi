import { Request, Response } from "express";
import BaseRoutes from "./base_routes";
import AuthController from "../controllers/auth_controller";
import DeviceController from "../controllers/device_controller";
import { auth } from "../middlewares/auth_middleware";
import ParameterController from "../controllers/parameter_controller";
import PickPlaceController from "../controllers/pickplace_controller";
import TestingController from "../controllers/tesing_controller";

const authC = new AuthController();
const deviceC = new DeviceController();
const parameterC = new ParameterController();
const pickplaceC = new PickPlaceController();
const testingC = new TestingController();

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
    this.router.get("/logout", auth, authC.logout);

    //Device
    this.router.post("/devices/input", deviceC.input);

    //Testing
    this.router.get("/testing/index", auth, testingC.index);
    this.router.get("/testing/latest", auth, testingC.latest);

    //Pick and Place
    this.router.get("/pickplace/index", auth, pickplaceC.index);
    this.router.get("/pickplace/latest", auth, pickplaceC.latest);

    //Parameter
    this.router.get("/parameter/:machine", auth, parameterC.index);
    this.router.get("/parameter/latest/:machine", auth, parameterC.latest);
    this.router.post("/parameter/new", auth, parameterC.new);
    this.router.post("/parameter/reset/:machine", auth, parameterC.reset);
  }
}

export default Routes;
