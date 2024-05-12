import express, { Router } from "express";
import RouterInterface from "./interface_routes";

abstract class BaseRoutes implements RouterInterface {

    public router: Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    abstract routes(): void;
}

export default BaseRoutes;