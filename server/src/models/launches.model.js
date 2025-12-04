const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customers: ["Sepehr Soft", "ZTM", "NASA"],
      upcoming: true,
      success: true,
    })
  );
}

function existsLaunchById(launchId) {
  return launches.has(launchId);
}

function abortLaunchById(launchId) {
  const launch = launches.get(launchId);

  launch.upcoming = false;
  launch.success = false;

  return launch;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchById,
  abortLaunchById,
};
