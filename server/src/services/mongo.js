const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://nasa-api:vxvsH9hxT3EkWyWT@nasacluster.mbg2xcm.mongodb.net/nasa?appName=nasaCluster";

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", () => {
  console.log("Mongo db connection error!");
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
