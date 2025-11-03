const express = require("express");

const { httpGetAllLaunches } = require("./launches.controller");

const lauchesRouter = express.Router();

lauchesRouter.get("/launches", httpGetAllLaunches);

module.exports = lauchesRouter;
