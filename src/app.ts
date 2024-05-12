import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import MongoDB from "./config/config";
import Routes from "./routes/routes";

class App {
  public app: Application;

  constructor() {
    dotenv.config();
    this.app = express();
    this.connection();
    this.plugins();
    this.routes();
  }

  private connection(): void {
    new MongoDB().connect();
  }

  protected plugins(): void {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(compression());
    this.app.use(express.static("public"));
  }

  protected routes(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.send("Ini BACKEND");
    })
    this.app.use("/api", new Routes().router);
  }
}

const port = process.env.SERVER_PORT || 5000;
const app = new App().app;

app.listen(port, () => console.log(`Server running on port ${port}`));
