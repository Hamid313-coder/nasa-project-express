const express = require("express");

const { getAllLaunches } = require("./launches.controller");

const lauchesRouter = express.Router();

lauchesRouter.get("/launches", getAllLaunches);

module.exports = lauchesRouter;
