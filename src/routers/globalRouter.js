import express from "express";
import routes from "../routes";

import { home, getMovieListByState } from "../controllers/mainControllers";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.movieList, getMovieListByState);

export default globalRouter;
