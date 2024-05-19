import { Request, Response } from "express";
import BaseRoutes from "./base_routes";
import AuthController from "../controllers/auth_controller";
import DeviceController from "../controllers/device_controller";
import { auth, validateLogin, validateRegister } from "../middlewares/auth_middleware";
import ParameterController from "../controllers/parameter_controller";
import PickPlaceController from "../controllers/pickplace_controller";
import TestingController from "../controllers/tesing_controller";
import TroubleshootController from "../controllers/troubleshoot_controller";
import ResetProdController from "../controllers/resetprod_controller";
import QualityController from "../controllers/quality_controller";
import AvailabilityController from "../controllers/availability_controller";
import PerformanceController from "../controllers/performance_controller";
import validateParameter from "../middlewares/parameter_middleware";
import { validateTroubleshoot } from "../middlewares/troubleshoot_middleware";
import { validateQualityDefect } from "../middlewares/quality_middleware";
import OEEController from "../controllers/oee_controller";
import UserController from "../controllers/user_controller";
import { onlyAdmin } from "../middlewares/role_middleware";
import { validateUserUpdate } from "../middlewares/user_middleware";

const authC = new AuthController();
const deviceC = new DeviceController();
const resetProdC = new ResetProdController();
const parameterC = new ParameterController();
const pickplaceC = new PickPlaceController();
const testingC = new TestingController();
const troubleshootC = new TroubleshootController();
const qualityC = new QualityController();
const availabilityC = new AvailabilityController();
const performanceC = new PerformanceController();
const oeeC = new OEEController();
const userC = new UserController();

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
    this.router.post("/login", validateLogin, authC.login);
    this.router.post("/register", validateRegister, authC.register);
    this.router.get("/logout", auth, authC.logout);

    //User
    this.router.get("/user/index", auth, onlyAdmin, userC.index);
    this.router.put("/user/update/:id", auth, onlyAdmin, validateUserUpdate, userC.update);
    this.router.delete("/user/destroy/:id", auth, onlyAdmin, userC.destroy);

    //Device
    this.router.post("/devices/input", deviceC.input);
    this.router.get("/devices/monitor/:machine", auth, deviceC.monitorProduction);

    //Reset Production
    this.router.post("/resetproduction/:machine", auth, resetProdC.reset);

    //Testing
    this.router.get("/testing/index", auth, testingC.index);
    this.router.get("/testing/latest", auth, testingC.latest);

    //Pick and Place
    this.router.get("/pickplace/index", auth, pickplaceC.index);
    this.router.get("/pickplace/latest", auth, pickplaceC.latest);

    //Parameter
    this.router.get("/parameter/:machine", auth, parameterC.index);
    this.router.get("/parameter/latest/:machine", auth, parameterC.latest);
    this.router.post("/parameter/new", auth, validateParameter, parameterC.new);
    this.router.post("/parameter/reset/:machine", auth, parameterC.reset);

    //Quality
    this.router.get("/quality/index/:machine", auth, qualityC.index);
    this.router.get("/quality/latest/:machine", auth, qualityC.latest);
    this.router.put("/quality/defect/:id", auth, validateQualityDefect, qualityC.defect);

    //Availability
    this.router.get("/availability/index/:machine", auth, availabilityC.index);
    this.router.get("/availability/latest/:machine", auth, availabilityC.latest);

    //Performance
    this.router.get("/performance/index/:machine", auth, performanceC.index);
    this.router.get("/performance/latest/:machine", auth, performanceC.latest);

    //OEE
    this.router.get("/oee/index/:machine", auth, oeeC.index);
    this.router.get("/oee/latest/:machine", auth, oeeC.latest);

    //Troubleshoot
    this.router.get("/troubleshoot/:machine", auth, troubleshootC.index);
    this.router.post("/troubleshoot/new", auth, validateTroubleshoot, troubleshootC.new);
    this.router.put("/troubleshoot/update/:id", auth, troubleshootC.update);

  }
}

export default Routes;
