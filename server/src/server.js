const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://nasa-api:3glOE70dRTAfv02T@nasacluster.mbg2xcm.mongodb.net/nasa?appName=nasaCluster";

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", () => {
  console.log("Mongo db connection error!");
});

async function startServer() {
  await mongoose.connect(MONGO_URL, {
    
  });

  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
}

startServer();
