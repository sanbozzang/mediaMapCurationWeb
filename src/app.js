import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";

import routes from "./routes";
import globalRouter from "./routers/globalRouter";

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes.home, globalRouter);

export default app;
