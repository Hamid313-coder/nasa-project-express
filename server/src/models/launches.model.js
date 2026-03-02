const axios = require("axios");

const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFUAL_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunchData() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem with downloading launch data");
    throw new Error("Launch Data download failed");
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => payload.customers);

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };

    await saveLuanch(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launch Data already loaded!");
  } else {
    await populateLaunchData();
  }
}

async function saveLuanch(launch) {
  await launchesDB.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function getAllLaunches(skip, limit) {
  return await launchesDB
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) throw new Error("No planet was found");

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ["Sepehr Soft", "ZTM", "NASA"],
    upcoming: true,
    success: true,
  });

  await saveLuanch(newLaunch);
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDB.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFUAL_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function findLaunch(filter) {
  return await launchesDB.findOne(filter);
}

async function existsLaunchById(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDB.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount == 1;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchById,
  abortLaunchById,
  loadLaunchesData,
};
